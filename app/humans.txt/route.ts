import { NextResponse } from "next/server"

export async function GET() {
  const textContent = `<a href="https://lynx-ai-rouge.vercel.app/" target="_blank" style="text-decoration: none; color: inherit">
           !7                                                      ^7           
           :BY.                                                  .?B?           
            JBG?.                                              .?GBP.           
             JBBB5~.                                         ^YBBBG.            
             PB!:?GB5~.                                   ^JGB5~:GB^            
            ^BG.   ^5BB5!.                             ^JGBG?.   JB?            
            :BG.     .JBBG5!.  .7????7!~!?JJYJ77:  .~JGBBP~      ?B?            
            .GB:    :  ^GGBBBP?~?GBBBBBBBBBBBBBY^~YGBBGBJ  .     5B~            
             7B?    :57.!BGGGBBBGGGGGGGGGGGGGGGGGBBGGGBP:~57    ^BP             
              5B^   :~GBYGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGBJ:.   PB:             
              :B?   ~GGGBGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG?   ^#?              
               ?  .?GGGGGGGGGGGGGGGGBGGGGGGGBGGGGGGGGGGGGGGGY:  !^              
                 ?GBBBBBBBBGGGGGGGG5PBGGGGBG5GGGGGGGGGBBBBBBBBY:                
               ^GBB57~^~7JPGBBGGGGB5.5BGGGG.?BGGGGBBBPY?!~~!JGBB?               
              7BBGGGP5Y.   .~JPBBBBP .GGGB~ 5BBBBG5!.    ?5PPGGGBP.             
             ?BBGGGGGBB~  :J.  :?5P! .GGGB: :55J~.  J!  .GBGGGGGBBG.            
            7#P!?GGGGGGG^  JP??:    ^5BGGGP^    .7?55. .5BGGGGBY~YBG            
           :G! ^GGGGBGGGBY^.:::::  .BBGGGGBB~  .::^:.^JGBGGGBBGB7 :PJ           
           !. :BGB?.YBBGGBBBGGGGB^ YBGGGGGGGG..GBGGGGBBGGBBG^!BGB!  7           
             .GBBP   ~5GBBBBBGGGGPYBGGGGGGGGBPYBGGGGBBBBG5!   JBGB:             
             ?BGB^     .:!?JPGGGGBBGGBBBBBBGPGBGGGGGY?!^.      GGB5             
             PBBP          .5BGGGG.  .~??~.  .PGGGGG~          7BGG.            
             PGGG5Y7^.     ~7J5GGGY^        :YGGGPY?7.    .:~?YPBGB:            
             5BG7.    ..   ^7J5GGGBBGY.   7PBBGGP5J7~.   .     ~PBB.            
             75.   .Y5^     ?55GBBBBBB7  .GBBBBBPYJ?     :JP~    ?5             
                   GG:.:.    .?5PY7~:.     .:~7JJJ:    .:..5#^                  
                   7BGB?.          .^!?JJ?7~:.         .~GGBY                   
                    ?BG          YBBBBBBBBBBBBJ          YBY                    
                     ~5           ^JGBBBBBB57~           Y?                     
                                     ^?5P?:                                     
BBBJ                                                           BBBBB        JBBB
GGB?                                                          BBP~PBG       JBGG
GGB?      ~PPP:     .5PP  JPP7.?PBBGPJ:   YGG5     PPP       GBG: ^BBP      JBGG
GGB?       JBBG.    PBBJ  5BBGY~^^!PBBB^   .GBB7 JBBP       5BB!   ?BBY     JBGG
GGB?        5BBP   JBB5   5BGP     :BGB7     JGBGBG        ?BB5.   :GGB7    JBGG
GGB?         5BBJ ~BBP    5BBP     .GGB7      GBBBG        BGBGGGGGGBBGB~   JBGG
GGBJ........  PBB?PBG     5BB5     .GGB7    YBB5?GBG?     GGB?:^^^^^:?BGG   ?BGG
BBBBBBBBBBBP   PGBBG:     5BB5     .BBB7  JBBB7   PBBG   GBBY         5BBG  7BBB
               BGB                                                              
             7JGBG                                                              
            BBBP?                                                               
<a/>


/* PROJECT */
   • Title:        ETNO SHOP (Borshchiv Embroidery Platform)
   • Year:         2026
   • Status:       Production / Active
              
/* FOUNDER / VISION */
   • Idea & Product Owner:  [Ім'я Проджекта / Засновника]
     Contact:               [Telegram або Email засновника]

/* DEVELOPMENT TEAM */
   • Frontend Developer:     Andrii
     Portfolio:              [Посилання]
     Contact:                [Посилання]

   • Backend Developer:      [Ім'я колеги]
     Portfolio:              [Посилання]
     Contact:                [Посилання]

   • UI/UX Designer:         [Ім'я дизайнера]
     Portfolio:              [Посилання]

=================================================================================
                                Made in Ukraine                                  
=================================================================================`

  // Повертаємо текст, але обгортаємо його в мінімальний HTML, який браузер з'їсть
  // і пофарбує в темний колір, якщо у юзера ввімкнена темна тема в системі
  const htmlWrapper = `<!DOCTYPE html>
<html>
<head>
  <title>humans.txt</title>
  <style>
    :root { color-scheme: dark; }
    * {margin: 0; padding: 0;}
    body { 
      background: #0f172a; color: #cbd5e1; 
      font-family: monospace; white-space: pre; padding: 20px;
    }
    main {
      width: fit-content;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <main>${textContent}<main/>
</body>
</html>`

  return new NextResponse(htmlWrapper, {
    headers: {
      // Кажемо браузеру, що це HTML, щоб він прочитав наші стилі
      "Content-Type": "text/html; charset=utf-8",
    },
  })
}
