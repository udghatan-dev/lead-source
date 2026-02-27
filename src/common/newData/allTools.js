import { IconAG, IconAmazon } from './icons';

const AllTools = [
    {
        id: 1,
        name: "article-generator",
        icon: IconAG,
        cover: IconAG,
        label: "Article Generator",
        category: "Article",
        description: "Generate SEO Ready Articles with Keywords Using AI",
        credit: 10,
        approved: true,
        variables: [
            {
                name: "topic",
                input: "text",
                type: "string",
                placeholder: "Article topic",
                label: "Article topic",
                help_text: "Enter your article topic to generate article",
                required: true
            },
            {
                name: "keyword",
                input: "text",
                type: "string",
                placeholder: "Keywords (Comma Seperated)",
                label: "Keywords",
                help_text: "Enter comma(,) seperated keywords related to your topic",
                required: false
            }
        ]
    },
    {
        id: 2,
        name: "amazon-single-product-review-writer",
        icon: IconAmazon,
        cover: IconAmazon,
        label: "Amazon Single Product Review Writer",
        category: "Article",
        description: "Generate Amazon Product Review Articles Using AI",
        approved: false,
        credit: 10,
        variables: [
            {
                name: "topic",
                input: "text",
                type: "string",
                placeholder: "Article topic",
                label: "Article topic",
                help_text: "Enter your article topic to generate article",
                required: true
            },
            {
                name: "keyword",
                input: "text",
                type: "string",
                placeholder: "Keywords (Comma Seperated)",
                label: "Keywords",
                help_text: "Enter comma(,) seperated keywords related to your topic",
                required: false
            }
        ]
    }
];


export default AllTools