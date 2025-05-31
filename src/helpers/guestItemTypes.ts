import { model } from "../viewmodel/peepViewModel";
import { drawImage } from "./customImages";

export const guestItemTypeList: GuestItemType[] = [
        "balloon",
        "beef_noodles",
        "burger",
        "candyfloss",
        "chicken",
        "chips",
        "chocolate",
        "coffee",
        "cookie",
        "doughnut",
        "drink",
        "empty_bottle",
        "empty_bowl_blue",
        "empty_bowl_red",
        "empty_box",
        "empty_drink_carton",
        "empty_burger_box",
        "empty_can",
        "empty_cup",
        "empty_juice_cup",
        "fried_rice_noodles",
        "fruit_juice",
        "funnel_cake",
        "hat",
        "hot_dog",
        "ice_cream",
        "iced_tea",
        "lemonade",
        "map",
        "meatball_soup",
        "photo1",
        "photo2",
        "photo3",
        "photo4",
        "pizza",
        "popcorn",
        "pretzel",
        "roast_sausage",
        "rubbish",
        "soybean_milk",
        "sub_sandwich",
        "sujeonggwa",
        "sunglasses",
        "tentacle",
        "toffee_apple",
        "toy",
        "tshirt",
        "umbrella",
        "voucher",
        "wonton_soup"
];

export function itemImage(item: GuestItemType, g: GraphicsContext): void {
	switch (item) {
		case "balloon": return drawImage(g, 5061, "balloonColour");
		case "beef_noodles": return drawImage(g, 5097);
		case "burger": return drawImage(g, 5067);
		case "candyfloss": return drawImage(g, 5070);
		case "chicken": return drawImage(g, 5085);
		case "chips": return drawImage(g, 5068);
		case "chocolate": return drawImage(g, 5093);
		case "coffee": return drawImage(g, 5083);
		case "cookie": return drawImage(g, 5105);
		case "doughnut": return drawImage(g, 5082);
		case "drink": return drawImage(g, 5066);
		case "empty_bottle": return drawImage(g, 5088);
		case "empty_bowl_blue": return drawImage(g, 5110);
		case "empty_bowl_red": return drawImage(g, 5106);
		case "empty_box": return drawImage(g, 5087);
		case "empty_drink_carton": return drawImage(g, 5107);
		case "empty_burger_box": return drawImage(g, 5073);
		case "empty_can": return drawImage(g, 5071);
		case "empty_cup": return drawImage(g, 5084);
		case "empty_juice_cup": return drawImage(g, 5108);
		case "fried_rice_noodles": return drawImage(g, 5098);
		case "fruit_juice": return drawImage(g, 5101);
		case "funnel_cake": return drawImage(g, 5095);
		case "hat": return drawImage(g, 5079, "hatColour");
		case "hot_dog": return drawImage(g, 5077);
		case "ice_cream": return drawImage(g, 5069);
		case "iced_tea": return drawImage(g, 5094);
		case "lemonade": return drawImage(g, 5086);
		case "map": return drawImage(g, 5063);
		case "meatball_soup": return drawImage(g, 5100);
		case "photo1": return drawImage(g, 5064);
		case "photo2": return drawImage(g, 5089);
		case "photo3": return drawImage(g, 5090);
		case "photo4": return drawImage(g, 5091);
		case "pizza": return drawImage(g, 5074);
		case "popcorn": return drawImage(g, 5076);
		case "pretzel": return drawImage(g, 5092);
		case "roast_sausage": return drawImage(g, 5109);
		case "rubbish": return drawImage(g, 5072);
		case "soybean_milk": return drawImage(g, 5102);
		case "sub_sandwich": return drawImage(g, 5104);
		case "sujeonggwa": return drawImage(g, 5103);
		case "sunglasses": return drawImage(g, 5096);
		case "tentacle": return drawImage(g, 5078);
		case "toffee_apple": return drawImage(g, 5080);
		case "toy": return drawImage(g, 5062);
		case "tshirt": return drawImage(g, 5081, "tshirtColour");
		case "umbrella": return drawImage(g, 5065, "umbrellaColour");
		case "voucher": return drawImage(g, 5075);
		case "wonton_soup": return drawImage(g, 5099);
	}
}

export const itemName: string[] = [
        `“${park.name}” Balloon`,
        `Beef Noodles`,
        `Burger`,
        `Candyfloss`,
        `Fried Chicken`,
        `Chips`,
        `Hot Chocolate`,
        `Coffee`,
        `Cookie`,
        `Doughnut`,
        `Drink`,
        `Empty Bottle`,
        `Empty Bowl`,
        `Empty Bowl`,
        `Empty Box`,
        `Empty Drink Carton`,
        `Empty Burger Box`,
        `Empty Can`,
        `Empty Cup`,
        `Empty Juice Cup`,
        `Fried Rice Noodles`,
        `Fruit Juice`,
        `Funnel Cake`,
        `“${park.name}” Hat`,
        `Hot Dog`,
        `Ice Cream`,
        `Iced Tea`,
        `Lemonade`,
        `Map of ${park.name}`,
        `Meatball Soup`,
        `On-ride Photo (1) of ${model._photo1RideName.get()}`,
        `On-ride Photo (2) of ${model._photo2RideName.get()}`,
        `On-ride Photo (3) of ${model._photo3RideName.get()}`,
        `On-ride Photo (4) of ${model._photo4RideName.get()}`,
        `Pizza`,
        `Popcorn`,
        `Pretzel`,
        `Roast Sausage`,
        `Rubbish`,
        `Soy Bean Milk`,
        `Sub Sandwich`,
        `Sujeonggwa`,
        `Sunglasses`,
        `Tentacle`,
        `Toffee Apple`,
        `“${park.name}” Cuddly Toy`,
        `“${park.name}” T-shirt`,
        `“${park.name}” Umbrella`,
        `Voucher`,
        `Wonton Soup`,
]