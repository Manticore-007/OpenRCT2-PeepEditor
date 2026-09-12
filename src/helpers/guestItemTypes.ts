import { drawImage } from "./customImages";

const colouredItems = new Set(["balloon", "hat", "tshirt", "umbrella"]);

export function itemImage(item: GuestItemType, g: GraphicsContext): void {
    const property = colouredItems.has(item) ? `${item}Colour` as keyof Guest : undefined;
    
    drawImage(g, itemImageMap[item], property);
}

const itemImageMap: Record<string, number> = {
    balloon: 5061,            beef_noodles: 5097,       burger: 5067,
    candyfloss: 5070,         chicken: 5085,            chips: 5068,
    chocolate: 5093,          coffee: 5083,             cookie: 5105,
    doughnut: 5082,           drink: 5066,              empty_bottle: 5088,
    empty_bowl_blue: 5110,    empty_bowl_red: 5106,     empty_box: 5087,
    empty_drink_carton: 5107, empty_burger_box: 5073,   empty_can: 5071,
    empty_cup: 5084,          empty_juice_cup: 5108,    fried_rice_noodles: 5098,
    fruit_juice: 5101,        funnel_cake: 5095,        hat: 5079,
    hot_dog: 5077,            ice_cream: 5069,          iced_tea: 5094,
    lemonade: 5086,           map: 5063,                meatball_soup: 5100,
    photo1: 5064,             photo2: 5089,             photo3: 5090,
    photo4: 5091,             pizza: 5074,              popcorn: 5076,
    pretzel: 5092,            roast_sausage: 5109,      rubbish: 5072,
    soybean_milk: 5102,       sub_sandwich: 5104,       sujeonggwa: 5103,
    sunglasses: 5096,         tentacle: 5078,           toffee_apple: 5080,
    toy: 5062,                tshirt: 5081,             umbrella: 5065,
    voucher: 5075,            wonton_soup: 5099
};

export const guestItemTypeList: GuestItemType[] = [
    "balloon",            "beef_noodles",       "burger",
    "candyfloss",         "chicken",            "chips",
    "chocolate",          "coffee",             "cookie",
    "doughnut",           "drink",              "empty_bottle",
    "empty_bowl_blue",    "empty_bowl_red",     "empty_box",
    "empty_drink_carton", "empty_burger_box",   "empty_can",
    "empty_cup",          "empty_juice_cup",    "fried_rice_noodles",
    "fruit_juice",        "funnel_cake",        "hat",
    "hot_dog",            "ice_cream",          "iced_tea",
    "lemonade",           "map",                "meatball_soup",
    "photo1",             "photo2",             "photo3",
    "photo4",             "pizza",              "popcorn",
    "pretzel",            "roast_sausage",      "rubbish",
    "soybean_milk",       "sub_sandwich",       "sujeonggwa",
    "sunglasses",         "tentacle",           "toffee_apple",
    "toy",                "tshirt",             "umbrella",
    "voucher",            "wonton_soup"
];

export const itemName: string[] = [
    `“${park.name}” Balloon`,    `Beef Noodles`,              `Burger`,
    `Candyfloss`,                `Fried Chicken`,             `Chips`,
    `Hot Chocolate`,             `Coffee`,                    `Cookie`,
    `Doughnut`,                  `Drink`,                     `Empty Bottle`,
    `Empty Bowl`,                `Empty Bowl`,                `Empty Box`,
    `Empty Drink Carton`,        `Empty Burger Box`,          `Empty Can`,
    `Empty Cup`,                 `Empty Juice Cup`,           `Fried Rice Noodles`,
    `Fruit Juice`,               `Funnel Cake`,               `“${park.name}” Hat`,
    `Hot Dog`,                   `Ice Cream`,                 `Iced Tea`,
    `Lemonade`,                  `Map of ${park.name}`,       `Meatball Soup`,
    `On-ride Photo (1) of`,      `On-ride Photo (2) of`,      `On-ride Photo (3) of`,
    `On-ride Photo (4) of`,      `Pizza`,                     `Popcorn`,
    `Pretzel`,                   `Roast Sausage`,             `Rubbish`,
    `Soy Bean Milk`,             `Sub Sandwich`,              `Sujeonggwa`,
    `Sunglasses`,                `Tentacle`,                  `Toffee Apple`,
    `“${park.name}” Cuddly Toy`, `“${park.name}” T-shirt`,    `“${park.name}” Umbrella`,
    `Voucher`,                   `Wonton Soup`
];