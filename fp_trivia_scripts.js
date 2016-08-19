
function trivia_global_variables()
{ 
   if (top.current_input_week == null)
   {
      alert("This page cannot be displayed in a separate window.");

      top.location.href = "nfl_empty.html";
      top.close();

      return false;
   }

   return true;
}

function determine_current_week()
{
   var week = top.current_input_week - 1;

   if (week <  1) week =  1;

   if (top.season_over == true) week++;

   if (week > 21) week = 21;

   return week;
}

function build_week_selection_menu()
{
   var current_input_week = determine_current_week();

   var d = document;

   d.writeln('<h2 align=center><font face="Comic Sans MS" color="#006600">Trivia</font></h2>');
   d.writeln('');
   d.writeln('<center>');
   d.writeln('');
   d.writeln('<input class="button" type=button value="Home" onmouseover=this.style.cursor="hand"; onClick=javacript:top.location.href="NFL.html";>');
   d.writeln('');
   d.writeln('<p>');
   d.writeln('');
   d.writeln('<form name="week_selection_form">');
   d.writeln('');
   d.writeln('<table border=0 cellspacing=0 cellpadding=0>');
   d.writeln('<tr align=center valign=center>');
   d.writeln('<td nowrap><font face="Times New Roman,Times" color="#990000" size=+1>Select:&nbsp;&nbsp;</font></td>');
   d.writeln('<td nowrap><select name="week_selection_menu" size=1 onChange="update_questions_and_answers();">');
   for (var i = current_input_week; i > 0; i--)
   {
      var week_name   = "";
      var week_number = current_input_week;


      if (i <= 17)
      {
         week_name   = "Regular Season Week ";
         week_number = i;
      }
      else
      {
         week_name   = "Post Season Week ";
         week_number = i-17;
      }

      if (i == current_input_week)
      {
         d.writeln('      <option selected value="'+i+'">'+week_name+week_number);
      }
      else
      {
         d.writeln('      <option          value="'+i+'">'+week_name+week_number);
      }
   }
   d.writeln('</select></td>');
   d.writeln('</tr>');
   d.writeln('</table>');
   d.writeln('');
   d.writeln('</form>');
   d.writeln('');
   d.writeln('</center>');

   d.close();

   return true;
}

function update_questions_and_answers()
{
   var              d = parent.frames.nfl_trivia.document;
   var  selected_week = determine_current_week();
   var selection_menu = document.week_selection_form.week_selection_menu;
   var     week_index = 0;


   week_index    = selection_menu.selectedIndex;
   selected_week = selection_menu.options[week_index].value;

   build_questions_and_answers(d,selected_week);

   return true;
}

function build_questions_and_answers(document,week)
{
   var current_input_week = determine_current_week();
   var trivia_index       = parent.frames.nfl_trivia_index;

   // Define questions.

   var questions1 = [

   "In what year did the American Football League (AFL) begin play?<span style=\"white-space: nowrap\"><br><br>a) 1950<span style=\"white-space: nowrap\"><br>b) 1955<span style=\"white-space: nowrap\"><br>c) 1960<span style=\"white-space: nowrap\"><br>d) 1965",
   "What trademark did Joe Namath bring to the AFL?<span style=\"white-space: nowrap\"><br><br>a) Long Hair<span style=\"white-space: nowrap\"><br>b) The Fu Manchu<span style=\"white-space: nowrap\"><br>c) White Shoes<span style=\"white-space: nowrap\"><br>d) The Bomb",
   "To reduce the number of tie games in the regular season, sudden death overtime was introduced in what year?<span style=\"white-space: nowrap\"><br><br>a) 1958<span style=\"white-space: nowrap\"><br>b) 1963<span style=\"white-space: nowrap\"><br>c) 1970<span style=\"white-space: nowrap\"><br>d) 1974",
   "What Dallas Cowboy was named rookie of the year in 1969?<span style=\"white-space: nowrap\"><br><br>a) Duane Thomas<span style=\"white-space: nowrap\"><br>b) Walt Garrison<span style=\"white-space: nowrap\"><br>c) Dan Reeves<span style=\"white-space: nowrap\"><br>d) Calvin Hill",
   "What player scored more than a 1,000 points in a Bears uniform?<span style=\"white-space: nowrap\"><br><br>a) Kevin Butler<span style=\"white-space: nowrap\"><br>b) George Blanda<span style=\"white-space: nowrap\"><br>c) Mac Percival<span style=\"white-space: nowrap\"><br>d) Walter Payton",
   "What team drafted John Elway in 1983 before he refused to play for them and was traded to Denver?<span style=\"white-space: nowrap\"><br><br>a) Saints<span style=\"white-space: nowrap\"><br>b) Falcons<span style=\"white-space: nowrap\"><br>c) Colts<span style=\"white-space: nowrap\"><br>d) Buccaneers",
   "Offensive lineman Jackie Slater played his entire 20 year career with which team?<span style=\"white-space: nowrap\"><br><br>a) Colts<span style=\"white-space: nowrap\"><br>b) Steelers<span style=\"white-space: nowrap\"><br>c) Rams<span style=\"white-space: nowrap\"><br>d) Redskins",
   "What Baltimore player was named defensive player of the year in 2003?<span style=\"white-space: nowrap\"><br><br>a) Ed Reed<span style=\"white-space: nowrap\"><br>b) Ray Lewis<span style=\"white-space: nowrap\"><br>c) Tony Siragusa<span style=\"white-space: nowrap\"><br>d) Terry Porter",
   "What former Packer running back holds the record for most points scored in a season?<span style=\"white-space: nowrap\"><br><br>a) William Henderson<span style=\"white-space: nowrap\"><br>b) Paul Hornung<span style=\"white-space: nowrap\"><br>c) Dorsey Levens<span style=\"white-space: nowrap\"><br>d) Jim Taylor",
   "Which one of these running backs who rushed for over 2,000 yards in a single season did it in only 14 games?<span style=\"white-space: nowrap\"><br><br>a) Terrell Davis<span style=\"white-space: nowrap\"><br>b) O. J. Simpson<span style=\"white-space: nowrap\"><br>c) Jamal Lewis<span style=\"white-space: nowrap\"><br>d) Barry Sanders",
   "In 1994 Cris Carter led the NFC in receptions while playing for which team?<span style=\"white-space: nowrap\"><br><br>a) Vikings<span style=\"white-space: nowrap\"><br>b) Buccaneers<span style=\"white-space: nowrap\"><br>c) Eagles<span style=\"white-space: nowrap\"><br>d) Falcons",
   "Who is the Bills all-time leader with 36 career 100-yard games?<span style=\"white-space: nowrap\"><br><br>a) James Lofton<span style=\"white-space: nowrap\"><br>b) Pete Metzelaars<span style=\"white-space: nowrap\"><br>c) Andre Reed<span style=\"white-space: nowrap\"><br>d) Thurman Thomas",
   "Which of the following Super Bowl winning quarterbacks also won the Heisman Trophy?<span style=\"white-space: nowrap\"><br><br>a) Tom Brady<span style=\"white-space: nowrap\"><br>b) Brett Favre<span style=\"white-space: nowrap\"><br>c) Jim Plunkett<span style=\"white-space: nowrap\"><br>d) John Elway",
   "Who was the first quarterback in 49ers history to win an NFL passing title?<span style=\"white-space: nowrap\"><br><br>a) Joe Montana<span style=\"white-space: nowrap\"><br>b) Steve Young<span style=\"white-space: nowrap\"><br>c) Frankie Albert<span style=\"white-space: nowrap\"><br>d) John Brodie",
   "Tony Romo is the only Cowboy quarterback to throw 4 touchdown passes in a game 4 times within a single season.  Who is the only other Cowboy quarterback to do it 3 times within a single season?<span style=\"white-space: nowrap\"><br><br>a) Don Meredith<span style=\"white-space: nowrap\"><br>b) Roger Staubach<span style=\"white-space: nowrap\"><br>c) Danny White<span style=\"white-space: nowrap\"><br>d) Troy Aikman",
   "The Dallas Cowboys set a record for going to the playoffs in consecutive years.  How many straight years did they make the playoffs?<span style=\"white-space: nowrap\"><br><br>a) 7<span style=\"white-space: nowrap\"><br>b) 8<span style=\"white-space: nowrap\"><br>c) 9<span style=\"white-space: nowrap\"><br>d) 10",
   "Who is the only head coach to win the Super Bowl and the Rose Bowl?<span style=\"white-space: nowrap\"><br><br>a) Jon Gruden<span style=\"white-space: nowrap\"><br>b) Mike Shanahan<span style=\"white-space: nowrap\"><br>c) Dick Vermeil<span style=\"white-space: nowrap\"><br>d) Mike Holmgren",
   "Who is the NFL career playoff rushing touchdowns leader?<span style=\"white-space: nowrap\"><br><br>a) Thurman Thomas<span style=\"white-space: nowrap\"><br>b) Marcus Allen<span style=\"white-space: nowrap\"><br>c) Jerome Bettis<span style=\"white-space: nowrap\"><br>d) Emmitt Smith",
   "Who is the NFL single game playoff rushing yards leader?<span style=\"white-space: nowrap\"><br><br>a) Lamar Smith<span style=\"white-space: nowrap\"><br>b) Timmy Smith<span style=\"white-space: nowrap\"><br>c) Eric Dickerson<span style=\"white-space: nowrap\"><br>d) Steve Van Buren",
   "Who is the NFL single game playoff receiving yards leader?<span style=\"white-space: nowrap\"><br><br>a) Reggie Wayne<span style=\"white-space: nowrap\"><br>b) Steve Smith<span style=\"white-space: nowrap\"><br>c) Eric Moulds<span style=\"white-space: nowrap\"><br>d) Anthony Carter",
   "Who is the NFL single game playoff passing yards leader?<span style=\"white-space: nowrap\"><br><br>a) Peyton Manning<span style=\"white-space: nowrap\"><br>b) Bernie Kosar<span style=\"white-space: nowrap\"><br>c) Drew Brees<span style=\"white-space: nowrap\"><br>d) Dan Fouts"

   ];

   var questions2 = [

   "What team did the Chiefs beat in 1970 in the final AFL game ever played?<span style=\"white-space: nowrap\"><br><br>a) Bengals<span style=\"white-space: nowrap\"><br>b) Raiders<span style=\"white-space: nowrap\"><br>c) Dolphins<span style=\"white-space: nowrap\"><br>d) Chargers",
   "Record setting defensive back Dick Lane was known by what nickname?<span style=\"white-space: nowrap\"><br><br>a) Hammer<span style=\"white-space: nowrap\"><br>b) Thunder<span style=\"white-space: nowrap\"><br>c) No-Gain<span style=\"white-space: nowrap\"><br>d) Night Train",
   "NFL legend Reggie White began his pro career with which United States Football League (USFL) team?<span style=\"white-space: nowrap\"><br><br>a) Memphis Showboats<span style=\"white-space: nowrap\"><br>b) Oakland Invaders<span style=\"white-space: nowrap\"><br>c) New Jersey Generals<span style=\"white-space: nowrap\"><br>d) Denver Gold",
   "Who is the only player to average 50 yards per punt in a single season?<span style=\"white-space: nowrap\"><br><br>a) Ray Guy<span style=\"white-space: nowrap\"><br>b) Sammy Baugh<span style=\"white-space: nowrap\"><br>c) Bob Waterfield<span style=\"white-space: nowrap\"><br>d) Jerrel Wilson",
   "What Pittsburgh player scored more points than any non-kicker in Steelers history?<span style=\"white-space: nowrap\"><br><br>a) Jerome Bettis<span style=\"white-space: nowrap\"><br>b) Hines Ward<span style=\"white-space: nowrap\"><br>c) Lynn Swann<span style=\"white-space: nowrap\"><br>d) Franco Harris",
   "In 1992 the Packers dealt a first round draft pick to acquire Brett Favre from what team?<span style=\"white-space: nowrap\"><br><br>a) Falcons<span style=\"white-space: nowrap\"><br>b) Saints<span style=\"white-space: nowrap\"><br>c) Seahawks<span style=\"white-space: nowrap\"><br>d) Rams",
   "Whose 7 sacks against the Seahawks in 1990 is the NFL's single game record?<span style=\"white-space: nowrap\"><br><br>a) Kevin Greene<span style=\"white-space: nowrap\"><br>b) Derrick Thomas<span style=\"white-space: nowrap\"><br>c) Bruce Smith<span style=\"white-space: nowrap\"><br>d) Lawrence Taylor",
   "What defensive back played for a record 20 seasons for the Redskins?<span style=\"white-space: nowrap\"><br><br>a) Champ Bailey<span style=\"white-space: nowrap\"><br>b) Brig Owens<span style=\"white-space: nowrap\"><br>c) Darrell Green<span style=\"white-space: nowrap\"><br>d) Pat Fischer",
   "What former two-time 1,000 yard rusher for the Buccaneers was traded to the Ravens?<span style=\"white-space: nowrap\"><br><br>a) Mike Alstott<span style=\"white-space: nowrap\"><br>b) Eric Rhett<span style=\"white-space: nowrap\"><br>c) Warrick Dunn<span style=\"white-space: nowrap\"><br>d) Priest Holmes",
   "Who is the only player to rush for 99 yards on one play?<span style=\"white-space: nowrap\"><br><br>a) Bo Jackson<span style=\"white-space: nowrap\"><br>b) Barry Sanders<span style=\"white-space: nowrap\"><br>c) Tony Dorsett<span style=\"white-space: nowrap\"><br>d) Hershel Walker",
   "In 2003 what Cardinals rookie caught a pass in his first 32 games?<span style=\"white-space: nowrap\"><br><br>a) Larry Fitzgerald<span style=\"white-space: nowrap\"><br>b) Bryant Johnson<span style=\"white-space: nowrap\"><br>c) Freddie Jones<span style=\"white-space: nowrap\"><br>d) Anquan Boldin",
   "Who was the first Packers player to amass more than 1,000 receiving yards 3 years in a row?<span style=\"white-space: nowrap\"><br><br>a) Sterling Sharpe<span style=\"white-space: nowrap\"><br>b) Don Hutson<span style=\"white-space: nowrap\"><br>c) James Lofton<span style=\"white-space: nowrap\"><br>d) Boyd Dowler",
   "Hall of Fame quarterback Terry Bradshaw was born in what state?<span style=\"white-space: nowrap\"><br><br>a) Louisiana<span style=\"white-space: nowrap\"><br>b) Texas<span style=\"white-space: nowrap\"><br>c) Mississippi<span style=\"white-space: nowrap\"><br>d) Arkansas",
   "What 49er's quarterback passed for 417 yards in an overtime win against the Cardinals in 2004?<span style=\"white-space: nowrap\"><br><br>a) Jim Druckenmiller<span style=\"white-space: nowrap\"><br>b) Tim Rattay<span style=\"white-space: nowrap\"><br>c) Jeff Garcia<span style=\"white-space: nowrap\"><br>d) Alex Smith",
   "In 1984 who became the first quarterback in NFL history to pass for more than 5,000 yards in a single season?<span style=\"white-space: nowrap\"><br><br>a) Joe Montana<span style=\"white-space: nowrap\"><br>b) Dan Fouts<span style=\"white-space: nowrap\"><br>c) Dan Marino<span style=\"white-space: nowrap\"><br>d) Phil Simms",
   "Besides the Dolphins, what other team did Don Shula coach in a Super Bowl?<span style=\"white-space: nowrap\"><br><br>a) Rams<span style=\"white-space: nowrap\"><br>b) Chiefs<span style=\"white-space: nowrap\"><br>c) Raiders<span style=\"white-space: nowrap\"><br>d) Colts",
   "Who was the Seattle Seahawks first head coach?<span style=\"white-space: nowrap\"><br><br>a) Jack Patera<span style=\"white-space: nowrap\"><br>b) John Ralston<span style=\"white-space: nowrap\"><br>c) Chuck Knox<span style=\"white-space: nowrap\"><br>d) John Robinson",
   "Who is the NFL career playoff receptions leader?<span style=\"white-space: nowrap\"><br><br>a) Jerry Rice<span style=\"white-space: nowrap\"><br>b) Reggie Wayne<span style=\"white-space: nowrap\"><br>c) Michael Irvin<span style=\"white-space: nowrap\"><br>d) Hines Ward",
   "Who is the NFL career playoff rushing yards leader?<span style=\"white-space: nowrap\"><br><br>a) Emmitt Smith<span style=\"white-space: nowrap\"><br>b) Thurman Thomas<span style=\"white-space: nowrap\"><br>c) Franco Harris<span style=\"white-space: nowrap\"><br>d) Tony Dorsett",
   "Who is the NFL career playoff receiving yards leader?<span style=\"white-space: nowrap\"><br><br>a) Michael Irvin<span style=\"white-space: nowrap\"><br>b) Reggie Wayne<span style=\"white-space: nowrap\"><br>c) Cliff Branch<span style=\"white-space: nowrap\"><br>d) Jerry Rice",
   "Who is the NFL career playoff passing yards leader?<span style=\"white-space: nowrap\"><br><br>a) Tom Brady<span style=\"white-space: nowrap\"><br>b) Joe Montana<span style=\"white-space: nowrap\"><br>c) Peyton Manning<span style=\"white-space: nowrap\"><br>d) Brett Favre"

   ];

   // Define answers.

   var answers1 = [

   "1960",
   "White Shoes",
   "1974",
   "Calvin Hill",
   "Kevin Butler",
   "Colts",
   "Rams",
   "Ray Lewis",
   "Paul Hornung",
   "O. J. Simpson",
   "Vikings",
   "Andre Reed",
   "Jim Plunkett",
   "John Brodie",
   "Don Meredith",
   "9",
   "Dick Vermeil",
   "Emmitt Smith",
   "Eric Dickerson",
   "Eric Moulds",
   "Bernie Kosar"

   ];

   var answers2 = [

   "Raiders",
   "Night Train",
   "Memphis Showboats",
   "Sammy Baugh",
   "Franco Harris",
   "Falcons",
   "Derrick Thomas",
   "Darrell Green",
   "Eric Rhett",
   "Tony Dorsett",
   "Anquan Boldin",
   "James Lofton",
   "Louisiana",
   "Tim Rattay",
   "Dan Marino",
   "Colts",
   "Jack Patera",
   "Jerry Rice",
   "Emmitt Smith",
   "Jerry Rice",
   "Peyton Manning"

   ];


   var d = document;

   d.open();

   d.writeln('<html>');
   d.writeln('');
   d.writeln('<head>');
   d.writeln('   <style type="text/css">');
   d.writeln('   <!--');
   d.writeln('   -->');
   d.writeln('   </style>');
   d.writeln('   <title>2016 Football Pool - Trivia</title>');
   d.writeln('</head>');
   d.writeln('');
   d.writeln('<body    text="#000000"');
   d.writeln('      bgcolor="#FFFFFF"');
   d.writeln('         link="#3333FF"');
   d.writeln('        vlink="#3333FF"');
   d.writeln('        alink="#000099"');
   d.writeln('   background="background_nfl_logo.gif"');
   d.writeln('        style="font-family: Times New Roman, Times">');
   d.writeln('');
   d.writeln('<center>');
   d.writeln('');
   d.writeln('<table align=center COLS=2 WIDTH="100%">');
   d.writeln(' <tr ALIGN=LEFT VALIGN=TOP>');
   if (questions2[0] != "NULL")
   {
      d.writeln('  <td WIDTH="50%"><b><font color="#000099"><u>Questions</u>:</font></b></td>');
      d.writeln('  <td WIDTH="50%"><b><font color="#006600"><u>Answers</u>:</font></b></td>');
   }
   else
   {
      d.writeln('  <td WIDTH="50%"><b><font color="#000099"><u>Question</u>:</font></b></td>');
      d.writeln('  <td WIDTH="50%"><b><font color="#006600"><u>Answer</u>:</font></b></td>');
   }
   d.writeln(' </tr>');
   d.writeln(' <tr ALIGN=LEFT VALIGN=TOP>');
   d.writeln('  <td WIDTH="50%"><font color="#000099"><b><br>');
   d.writeln('   <ol start=1 style="color: #000099; font-weight: bold">');
   d.writeln('    <li>');
   d.writeln('     '+questions1[week-1]);
   d.writeln('    </li>');
   d.writeln('   </ol>');
   d.writeln('  </b></font></td>');
   d.writeln('  <td WIDTH="50%"><font color="#006600"><b><br>');
   d.writeln('   <ol start=1 style="color: #006600; font-weight: bold">');
   d.writeln('    <li>');
   if ( (top.games_over == false) && (week == current_input_week) )
   {
      d.writeln('     '+'Available on Monday night.');
   }
   else
   {
      d.writeln('     '+answers1[week-1]);
   }
   d.writeln('    </li>');
   d.writeln('   </ol>');
   d.writeln('  </b></font></td>');
   d.writeln(' </tr>');
   if (questions2[0] != "NULL")
   {
      d.writeln(' <tr ALIGN=LEFT VALIGN=TOP>');
      d.writeln('  <td WIDTH="50%"><font color="#000099"><b>');
      if (navigator.appName.substring(0,8) == "Netscape") d.writeln('  <br>');
      d.writeln('   <ol start=2 style="color: #000099; font-weight: bold">');
      d.writeln('    <li>');
      d.writeln('     '+questions2[week-1]);
      d.writeln('    </li>');
      d.writeln('   </ol>');
      d.writeln('  </b></font></td>');
      d.writeln('  <td WIDTH="50%"><font color="#006600"><b>');
      if (navigator.appName.substring(0,8) == "Netscape") d.writeln('  <br>');
      d.writeln('   <ol start=2 style="color: #006600; font-weight: bold">');
      d.writeln('    <li>');
      if ( (top.games_over == false) && (week == current_input_week) )
      {
         d.writeln('     '+'Available on Monday night.');
      }
      else
      {
         d.writeln('     '+answers2[week-1]);
      }
      d.writeln('    </li>');
      d.writeln('   </ol>');
      d.writeln('  </b></font></td>');
      d.writeln(' </tr>');
   }
   d.writeln('</table>');
   d.writeln('');
   d.writeln('</center>');
   d.writeln('');
   d.writeln('</body>');
   d.writeln('');
   d.writeln('</html>');

   d.close();

   trivia_index.document.week_selection_form.week_selection_menu.focus();

   return true;
}