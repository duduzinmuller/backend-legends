export const badRequest = (body: { message: string }) => ({
    statusCode: 400,
    body,
});

export const created = (body: string) => ({
    statusCode: 201,
    body,
});

export const serverError = () => ({
    statusCode: 500,
    body: {
        message: "Erro interno no servidor",
    },
});

export const ok = (body: string) => ({
    statusCode: 200,
    body,
});

export const notFound = (body: { message: string }) => ({
    statusCode: 404,
    body,
});
