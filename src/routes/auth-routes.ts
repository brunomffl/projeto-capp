import { Router } from "express";
import { google } from 'googleapis';

// Declaração global para TypeScript
declare global {
    var oauthTokens: any;
    var oauthClient: any;
}

const authRoutes = Router();

// Endpoint para iniciar autenticação OAuth2
authRoutes.get("/google", async (req, res) => {
    try {
        // Configurar OAuth2 client
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback'
        );

        const scopes = [
            'https://www.googleapis.com/auth/documents',
            'https://www.googleapis.com/auth/drive.file',
            'profile',
            'email'
        ];

        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            include_granted_scopes: true
        });

        console.log("🚀 Redirecionando para autenticação Google...");
        
        res.redirect(url);
    } catch (error) {
        console.error("❌ Erro ao configurar OAuth2:", error);
        res.status(500).json({ 
            error: "Erro ao configurar autenticação Google", 
            details: error instanceof Error ? error.message : String(error)
        });
    }
});

// Endpoint de callback OAuth2
authRoutes.get("/google/callback", async (req, res) => {
    try {
        const { code } = req.query;
        
        if (!code) {
            return res.status(400).json({ 
                error: "Código de autorização não fornecido",
                message: "Erro na autenticação Google" 
            });
        }

        console.log("✅ Processando autenticação Google...");
        
        // Configurar OAuth2 client
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback'
        );

        // Trocar código por tokens
        const { tokens } = await oauth2Client.getToken(code as string);
        console.log("✅ Tokens OAuth2 obtidos com sucesso!");

        // Configurar tokens
        oauth2Client.setCredentials(tokens);

        // Obter informações do usuário
        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const userInfo = await oauth2.userinfo.get();

        console.log("✅ Usuário autenticado:", userInfo.data.email);

        // Salvar tokens globalmente (em produção, usar banco de dados)
        global.oauthTokens = tokens;
        global.oauthClient = oauth2Client;

        // Redirecionar para página de sucesso ou dashboard
        res.json({
            success: true,
            message: "🎉 Autenticação Google realizada com sucesso!",
            user: {
                email: userInfo.data.email,
                name: userInfo.data.name,
                picture: userInfo.data.picture
            },
            redirectTo: "/pareceres"
        });

    } catch (error) {
        console.error("❌ Erro no callback OAuth2:", error);
        res.status(500).json({ 
            error: "Erro ao processar autenticação Google", 
            details: error instanceof Error ? error.message : String(error)
        });
    }
});

// Endpoint para verificar status da autenticação
authRoutes.get("/status", (req, res) => {
    const isAuthenticated = !!(global.oauthClient && global.oauthTokens);
    
    res.json({
        authenticated: isAuthenticated,
        message: isAuthenticated 
            ? "✅ Usuário autenticado - Google Docs disponível" 
            : "❌ Autenticação necessária para usar Google Docs"
    });
});

// Endpoint para logout
authRoutes.post("/logout", (req, res) => {
    global.oauthTokens = null;
    global.oauthClient = null;
    
    res.json({
        success: true,
        message: "✅ Logout realizado com sucesso"
    });
});

export { authRoutes };
