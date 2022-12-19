export enum colour {
    Black,               //0
    Grey,                //1
    White,               //2
    DarkPurple,         //3
    LightPurple,        //4
    BrightPurple,       //5
    DarkBlue,           //6
    LightBlue,          //7
    IcyBlue,            //8
    Teal,                //9
    Aquamarine,          //10
    SaturatedGreen,     //11
    DarkGreen,          //12
    MossGreen,          //13
    BrightGreen,        //14
    OliveGreen,         //15
    DarkOliveGreen,    //16
    BrightYellow,       //17
    Yellow,              //18
    DarkYellow,         //19
    LightOrange,        //20
    DarkOrange,         //21
    LightBrown,         //22
    SaturatedBrown,     //23
    DarkBrown,          //24
    SalmonPink,         //25
    BordeauxRed,        //26
    SaturatedRed,       //27
    BrightRed,          //28
    DarkPink,           //29
    BrightPink,         //30
    LightPink,          //31
};

export const colourList = Object.keys(colour).filter((value) => isNaN(Number(value)));