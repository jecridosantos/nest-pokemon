export const AppConfiguration = () => ({
    enviroment: process.env.NODE_ENV || 'dev',
    mongodb: process.env.MONDODB,
    port: process.env.PORT || 3002,
    default_limit: process.env.DEFAULT_LIMIT || 7
});

