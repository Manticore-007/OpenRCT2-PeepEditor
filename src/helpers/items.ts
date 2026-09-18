// 1. Single Source of Truth
export const itemData: Record<string, { image: number; name: string }> = {
    balloon:            { image: 5061, name: `“${park.name}” Balloon` },
    beef_noodles:       { image: 5097, name: `Beef Noodles` },
    burger:             { image: 5067, name: `Burger` },
    candyfloss:         { image: 5070, name: `Candyfloss` },
    chicken:            { image: 5085, name: `Fried Chicken` },
    chips:              { image: 5068, name: `Chips` },
    chocolate:          { image: 5093, name: `Hot Chocolate` },
    coffee:             { image: 5083, name: `Coffee` },
    cookie:             { image: 5105, name: `Cookie` },
    doughnut:           { image: 5082, name: `Doughnut` },
    drink:              { image: 5066, name: `Drink` },
    empty_bottle:       { image: 5088, name: `Empty Bottle` },
    empty_bowl_blue:    { image: 5110, name: `Empty Bowl` },
    empty_bowl_red:     { image: 5106, name: `Empty Bowl` },
    empty_box:          { image: 5087, name: `Empty Box` },
    empty_drink_carton: { image: 5107, name: `Empty Drink Carton` },
    empty_burger_box:   { image: 5073, name: `Empty Burger Box` },
    empty_can:          { image: 5071, name: `Empty Can` },
    empty_cup:          { image: 5084, name: `Empty Cup` },
    empty_juice_cup:    { image: 5108, name: `Empty Juice Cup` },
    fried_rice_noodles: { image: 5098, name: `Fried Rice Noodles` },
    fruit_juice:        { image: 5101, name: `Fruit Juice` },
    funnel_cake:        { image: 5095, name: `Funnel Cake` },
    hat:                { image: 5079, name: `“${park.name}” Hat` },
    hot_dog:            { image: 5077, name: `Hot Dog` },
    ice_cream:          { image: 5069, name: `Ice Cream` },
    iced_tea:           { image: 5094, name: `Iced Tea` },
    lemonade:           { image: 5086, name: `Lemonade` },
    map:                { image: 5063, name: `Map of ${park.name}` },
    meatball_soup:      { image: 5100, name: `Meatball Soup` },
    photo1:             { image: 5064, name: `On-ride Photo (1) of` },
    photo2:             { image: 5089, name: `On-ride Photo (2) of` },
    photo3:             { image: 5090, name: `On-ride Photo (3) of` },
    photo4:             { image: 5091, name: `On-ride Photo (4) of` },
    pizza:              { image: 5074, name: `Pizza` },
    popcorn:            { image: 5076, name: `Popcorn` },
    pretzel:            { image: 5092, name: `Pretzel` },
    roast_sausage:      { image: 5109, name: `Roast Sausage` },
    rubbish:            { image: 5072, name: `Rubbish` },
    soybean_milk:       { image: 5102, name: `Soy Bean Milk` },
    sub_sandwich:       { image: 5104, name: `Sub Sandwich` },
    sujeonggwa:         { image: 5103, name: `Sujeonggwa` },
    sunglasses:         { image: 5096, name: `Sunglasses` },
    tentacle:           { image: 5078, name: `Tentacle` },
    toffee_apple:       { image: 5080, name: `Toffee Apple` },
    toy:                { image: 5062, name: `“${park.name}” Cuddly Toy` },
    tshirt:             { image: 5081, name: `“${park.name}” T-shirt` },
    umbrella:           { image: 5065, name: `“${park.name}” Umbrella` },
    voucher:            { image: 5075, name: `Voucher` },
    wonton_soup:        { image: 5099, name: `Wonton Soup` }
};

// 2. Initialized Exports
export const guestItemTypeList: GuestItemType[] = [];
export const itemImageMap: Record<string, number> = {};
export const itemImageIds: number[] = [];
export const itemName: string[] = [];

// 3. Populate using a single loop for full compatibility
for (const key in itemData) {
    if (Object.prototype.hasOwnProperty.call(itemData, key)) {
        const item = itemData[key];
        
        guestItemTypeList.push(key as GuestItemType);
        itemImageMap[key] = item.image;
        itemImageIds.push(item.image);
        itemName.push(item.name);
    }
}