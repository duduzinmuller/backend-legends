import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const main = async () => {
    await prisma.product.createMany({
        data: [
            {
                name: "Camiseta Preta",
                description: "Camiseta de algodão, confortável e estilosa.",
                price: 49.99,
                imageUrl:
                    "https://images.tcdn.com.br/img/img_prod/586374/camiseta_masculina_lisa_basica_adulto_malwee_preto_7226_1_2ec66bbb015668582fc8023188f07089.jpg",
            },
            {
                name: "Tênis Nike",
                description: "Tênis esportivo, ideal para corridas.",
                price: 299.99,
                imageUrl:
                    "https://douradocalcados.com.br/wp-content/uploads/2022/07/IMG-20220725-WA0075.jpg",
            },
            {
                name: "Relógio Smartwatch",
                description:
                    "Relógio inteligente com diversas funcionalidades.",
                price: 199.99,
                imageUrl:
                    "https://cdn.awsli.com.br/2500x2500/2564/2564148/produto/21077951527e7db069d.jpg",
            },
            {
                name: "Fone Bluetooth",
                description:
                    "Fone de ouvido sem fio com alta qualidade de som.",
                price: 79.99,
                imageUrl:
                    "https://images.tcdn.com.br/img/img_prod/1140357/fone_bluetooth_auric_tws_ep_tws_200bk_pr_c3tech_3517_2_bba7a3e9fbc9c70badc23421d8cd6e0b.jpg",
            },
            {
                name: "Notebook Gamer",
                description: "Notebook de alto desempenho para jogos pesados.",
                price: 4999.99,
                imageUrl:
                    "https://m.media-amazon.com/images/I/51O4bS147tL._AC_UF894,1000_QL80_.jpg",
            },
            {
                name: "Smart TV 4K",
                description: "Televisão 4K com tela de 55 polegadas.",
                price: 2599.99,
                imageUrl:
                    "https://m.media-amazon.com/images/I/51CjFKt5whL._AC_UF1000,1000_QL80_.jpg",
            },
            {
                name: "Cadeira Gamer",
                description: "Cadeira ergonômica com ajuste de altura.",
                price: 899.99,
                imageUrl:
                    "https://m.media-amazon.com/images/I/71rpGOUI-2L._AC_UF894,1000_QL80_.jpg",
            },
            {
                name: "Teclado Mecânico",
                description: "Teclado com switches mecânicos para jogos.",
                price: 349.99,
                imageUrl:
                    "https://cdn.awsli.com.br/2500x2500/1867/1867451/produto/209589899/61nrwltbxfl-_ac_sy450_-22-03-2023-vleqlb.jpg",
            },
            {
                name: "Monitor UltraWide",
                description: "Monitor com tela ultrawide para produtividade.",
                price: 1799.99,
                imageUrl:
                    "https://s2-techtudo.glbimg.com/fxebTxHBqus1meA__IX0gAzL_yo=/0x0:695x365/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2019/P/Y/AHiQgNTwSsXK9TIL32JA/monitor-samsung-ultra49.jpg",
            },
            {
                name: "Console PlayStation 5",
                description:
                    "Console de última geração com gráficos incríveis.",
                price: 4499.99,
                imageUrl: "https://m.media-amazon.com/images/I/51+qnZm7V7L.jpg",
            },
        ],
    });

    console.log("Produtos inseridos com sucesso!");
};

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
