"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const uploadsPath = (0, path_1.join)(process.cwd(), 'uploads');
    const profileUploadsPath = (0, path_1.join)(uploadsPath, 'profile');
    if (!(0, fs_1.existsSync)(profileUploadsPath)) {
        (0, fs_1.mkdirSync)(profileUploadsPath, { recursive: true });
    }
    app.useStaticAssets(uploadsPath, { prefix: '/uploads/' });
    // Enable CORS: allow common dev ports (4200 and 4201)
    app.enableCors({
        origin: ['http://localhost:4200', 'http://localhost:4201'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    // Add global API prefix so frontend can call /api/* endpoints
    app.setGlobalPrefix('api');
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Project Manager API')
        .setDescription('Documentacion de endpoints y tipos de peticiones')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const swaggerDocument = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api/docs', app, swaggerDocument, {
        swaggerOptions: {
            persistAuthorization: true,
            displayRequestDuration: true,
            docExpansion: 'list',
        },
        customSiteTitle: 'Project Manager API Docs',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`Backend running on http://localhost:${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api/docs`);
}
bootstrap();
