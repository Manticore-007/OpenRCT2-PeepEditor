export enum costume {
    "Panda",				//0
    "Tiger",				//1
    "Elephant",				//2
    "Gladiator",			//3
    "Gorilla",				//4
    "Snowman",				//5
    "Knight",				//6
    "Astronaut",			//7
    "Bandit",				//8
    "Sheriff",				//9
    "Pirate",				//10
    "Icecream",				//11
    "Chips",				//12
    "Burger",				//13
    "Soda can",				//14
    "Balloon",				//15
    "Candyfloss",			//16
    "Umbrella",				//17
    "Pizza",				//18
    "Security",				//19
    "Popcorn",				//20
    "Arms crossed",			//21
    "Head down",			//22
    "Nauseous",				//23
    "Very nauseous",		//24
    "Needs toilet",			//25
    "Hat",					//26
    "Hotdog",				//27
    "Tentacle",				//28
    "Toffee apple",			//29
    "Donut",				//30
    "Coffee",				//31
    "Nuggets",				//32
    "Lemonade",				//33
    "Walking",				//34
    "Pretzel",				//35
    "Sunglasses",			//36
    "Sujongkwa",			//37
    "Juice",				//38
    "Funnel cake",			//39
    "Noodles",				//40
    "Sausage",				//41
    "Soup",					//42
    "Sandwich",				//43
    "Guest",				//252
    "Handyman",				//253
    "Mechanic",				//254
    "Security guard",       //255
}

export const costumeList = Object.keys(costume).filter((value) => isNaN(Number(value)));