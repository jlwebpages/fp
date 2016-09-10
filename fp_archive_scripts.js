
function display_archive_page(archive_year)
{
   var local_mobile_flag = false;
   var min_archive_year  = 1997;
   var max_archive_year  = 2015;

   if ( (typeof(top.mobile) != "undefined") && (top.mobile == true) ) local_mobile_flag = true;

   if ( (archive_year < min_archive_year) || (archive_year > max_archive_year) )
   {
      archive_year = max_archive_year;
   }

   var d = document.open("text/html","replace");

   d.writeln('<html>');
   d.writeln('');
   d.writeln('<head>');
   d.writeln('   <title>NFL Football Pool</title>');
   d.writeln('   <link href="fp.css" rel="stylesheet" type="text/css">');
   d.writeln('   <script language="JavaScript" src=fp_archive_scripts.js></script>');
   d.writeln('</head>');
   d.writeln('');
   d.writeln('<body>');
   d.writeln('');
   d.writeln('');
   d.writeln('<script language="JavaScript">');
   d.writeln('');
   d.writeln('   function change_year()');
   d.writeln('   {');
   d.writeln('      var selected_year         = -1;');
   d.writeln('      var selected_year_index   = 0;');
   d.writeln('      var selected_year_element = 0;');
   d.writeln('      var year_form             = document.year_form;');
   d.writeln('');
   d.writeln('      for (var i = 0; i < year_form.elements.length; i++)');
   d.writeln('      {');
   d.writeln('         if (year_form.elements[i].name == "year_menu")');
   d.writeln('         {');
   d.writeln('            selected_year_element = year_form.elements[i];');
   d.writeln('            selected_year_index   = selected_year_element.selectedIndex;');
   d.writeln('            selected_year         = selected_year_element.options[selected_year_index].value;');
   d.writeln('         }');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      display_archive_page(selected_year);');
   d.writeln('');
   d.writeln('      return true;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('');
   d.writeln('   function open_post_season_archive()');
   d.writeln('   {');
   d.writeln('      var title = "NFL Football Pool Archive - '+archive_year+' Post Season Summary";');
   d.writeln('');
   d.writeln('      w = window.open("","'+archive_year+'_post_season_summary","status=no,scrollbars=yes,resizable=yes",true);');
   d.writeln('');
   d.writeln('      w.resizeTo(screen.width,screen.height);');
   d.writeln('');
   d.writeln('      w.moveTo(0,0);');
   d.writeln('');
   d.writeln('      wd = w.document.open();');
   d.writeln('');
   d.writeln("      wd.writeln('<html>');");
   d.writeln("      wd.writeln('');");
   d.writeln("      wd.writeln('<head>');");
   d.writeln("      wd.writeln('   <title>'+title+'</title>');");
   d.writeln("      wd.writeln('</head>');");
   d.writeln("      wd.writeln('');");
   d.writeln("      wd.writeln('<frameset rows=\"0,*\" border=\"0\" frameborder=\"0\" framespacing=\"0\">');");
   d.writeln("      wd.writeln('   <frame noresize src=\"fp_empty.html\" name=\"gv\" scrolling=\"no\">');");
   d.writeln("      wd.writeln('   <frame noresize src=\"fp_empty.html\" name=\"archive\" marginheight=\"5px\" marginwidth=\"5px\">');");
   d.writeln("      wd.writeln('</frameset>');");
   d.writeln("      wd.writeln('');");
   d.writeln("      wd.writeln('</html>');");
   d.writeln('');
   d.writeln('      wd.close();');
   d.writeln('');
   d.writeln('      // Define global variables for this new window.');
   d.writeln('');
   d.writeln("      w.gv.document.writeln('<script>');");
   d.writeln("      w.gv.document.writeln('var archive_mode;');");
   d.writeln("      w.gv.document.writeln('var archive_year;');");
   d.writeln("      w.gv.document.writeln('var current_input_week;');");
   d.writeln("      w.gv.document.writeln('var form_view;');");
   d.writeln("      w.gv.document.writeln('var games_over;');");
   d.writeln("      w.gv.document.writeln('var home_scores;');");
   d.writeln("      w.gv.document.writeln('var mobile;');");
   d.writeln("      w.gv.document.writeln('var mode;');");
   d.writeln("      w.gv.document.writeln('var order_by;');");
   d.writeln("      w.gv.document.writeln('var player_index;');");
   d.writeln("      w.gv.document.writeln('var ps_players;');");
   d.writeln("      w.gv.document.writeln('var scores_already_assigned;');");
   d.writeln("      w.gv.document.writeln('var visitor_scores;');");
   d.writeln("      w.gv.document.writeln('</'+'script>');");
   d.writeln('');
   d.writeln('      // Assign values to global variables for this new window.');
   d.writeln('');
   d.writeln('      w.gv.archive_mode            = "Post Season";');
   d.writeln('      w.gv.archive_year            = '+archive_year+';');
   d.writeln('      w.gv.current_input_week      = 0;');
   d.writeln('      w.gv.form_view               = "expanded";');
   d.writeln('      w.gv.games_over              = true;');
   d.writeln('      w.gv.home_scores             = ["0","0","0","0","0","0","0","0","0","0","0"];');
   d.writeln('      w.gv.mobile                  = top.mobile;');
   d.writeln('      w.gv.mode                    = "summary_archive";');
   d.writeln('      w.gv.order_by                = "players";');
   d.writeln('      w.gv.player_index            = 0;');
   d.writeln('      w.gv.ps_players              = "";');
   d.writeln('      w.gv.scores_already_assigned = false;');
   d.writeln('      w.gv.visitor_scores          = ["0","0","0","0","0","0","0","0","0","0","0"];');
   d.writeln('');
   d.writeln('      w.archive.location.href="fp_forms_'+archive_year+'.html";');
   d.writeln('');
   d.writeln('      return;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('');
   d.writeln('   function open_regular_season_archive(received_mode)');
   d.writeln('   {');
   d.writeln('      var title = "NFL Football Pool Archive - '+archive_year+' Regular Season";');
   d.writeln('');
   d.writeln('      if (received_mode == "weekly_archive")');
   d.writeln('      {');
   d.writeln('         title = title + " Weekly Results";');
   d.writeln('      }');
   d.writeln('      else // Must be "Summary"');
   d.writeln('      {');
   d.writeln('         title = title + " Summary";');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      w = window.open("","'+archive_year+'_regular_"+received_mode,"status=no,scrollbars=yes,resizable=yes",true);');
   d.writeln('');
   d.writeln('      w.resizeTo(screen.width,screen.height);');
   d.writeln('');
   d.writeln('      w.moveTo(0,0);');
   d.writeln('');
   d.writeln('      wd = w.document.open();');
   d.writeln('');
   d.writeln("      wd.writeln('<html>');");
   d.writeln("      wd.writeln('');");
   d.writeln("      wd.writeln('<head>');");
   d.writeln("      wd.writeln('   <title>'+title+'</title>');");
   d.writeln("      wd.writeln('</head>');");
   d.writeln("      wd.writeln('');");
   d.writeln("      wd.writeln('<frameset rows=\"0,*\" border=\"0\" frameborder=\"0\" framespacing=\"0\">');");
   d.writeln("      wd.writeln('   <frame noresize src=\"fp_empty.html\" name=\"gv\" scrolling=\"no\">');");
   d.writeln("      wd.writeln('   <frame noresize src=\"fp_empty.html\" name=\"archive\" marginheight=\"5px\" marginwidth=\"5px\">');");
   d.writeln("      wd.writeln('</frameset>');");
   d.writeln("      wd.writeln('');");
   d.writeln("      wd.writeln('</html>');");
   d.writeln('');
   d.writeln('      wd.close();');
   d.writeln('');
   d.writeln('      // Define global variables for this new window.');
   d.writeln('');
   d.writeln("      w.gv.document.writeln('<script>');");
   d.writeln("      w.gv.document.writeln('var all_visiting_teams;');");
   d.writeln("      w.gv.document.writeln('var all_home_teams;');");
   d.writeln("      w.gv.document.writeln('var all_open_dates;');");
   d.writeln("      w.gv.document.writeln('var archive_mode;');");
   d.writeln("      w.gv.document.writeln('var archive_year;');");
   d.writeln("      w.gv.document.writeln('var current_input_week;');");
   d.writeln("      w.gv.document.writeln('var form_view;');");
   d.writeln("      w.gv.document.writeln('var games_over;');");
   d.writeln("      w.gv.document.writeln('var home_scores;');");
   d.writeln("      w.gv.document.writeln('var mn_points_entered;');");
   d.writeln("      w.gv.document.writeln('var mobile;');");
   d.writeln("      w.gv.document.writeln('var mode;');");
   d.writeln("      w.gv.document.writeln('var opponent_index;');");
   d.writeln("      w.gv.document.writeln('var order_by;');");
   d.writeln("      w.gv.document.writeln('var player_index;');");
   d.writeln("      w.gv.document.writeln('var prelim_winners;');");
   d.writeln("      w.gv.document.writeln('var rs_players;');");
   d.writeln("      w.gv.document.writeln('var selected_week;');");
   d.writeln("      w.gv.document.writeln('var visiting_scores;');");
   d.writeln("      w.gv.document.writeln('</'+'script>');");
   d.writeln('');
   d.writeln('      // Assign values to global variables for this new window.');
   d.writeln('');
   d.writeln('      w.gv.all_visiting_teams  = "";');
   d.writeln('      w.gv.all_home_teams      = "";');
   d.writeln('      w.gv.all_open_dates      = "";');
   d.writeln('      w.gv.archive_mode        = "regular_season";');
   d.writeln('      w.gv.archive_year        = '+archive_year+';');
   d.writeln('      w.gv.current_input_week  = 0;');
   d.writeln('      w.gv.form_view           = "expanded";');
   d.writeln('      w.gv.games_over          = true;');
   d.writeln('      w.gv.home_scores         = ["","","","","","","","","","","","","","","",""];');
   d.writeln('      w.gv.mn_points_entered   = 0;');
   d.writeln('      w.gv.mobile              = top.mobile;');
   d.writeln('      w.gv.mode                = received_mode;');
   d.writeln('      w.gv.opponent_index      = 0;');
   d.writeln('      w.gv.order_by            = "players";');
   d.writeln('      w.gv.player_index        = 0;');
   d.writeln('      w.gv.prelim_winners      = ["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"];');
   d.writeln('      w.gv.rs_players          = "";');
   d.writeln('      w.gv.selected_week       = 0;');
   d.writeln('      w.gv.visiting_scores     = ["","","","","","","","","","","","","","","",""];');
   d.writeln('');
   d.writeln('      w.archive.location.href="fp_forms_'+archive_year+'.html";');
   d.writeln('');
   d.writeln('      return;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('');
   d.writeln('   function open_results_window()');
   d.writeln('   {');
   d.writeln('      window.open("fp_results_'+archive_year+'.html","fp_picks","");');
   d.writeln('      top.display_frame("fp_picks");');
   d.writeln('      return;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('');
   d.writeln('</'+'script>');
   d.writeln('');
   d.writeln('');
   d.writeln('<table class="table">');
   d.writeln('');
   if (local_mobile_flag == false)
   {
      // Write table row to document.

      d.writeln('<tr>');
      d.writeln('<td class="dark_gray_cell">ARCHIVE</td>');
      d.writeln('<td class="dark_gray_cell" style="border-right: solid 1px black"><a class="red_link" href="fp.html" target="_top">HOME</a></td>');
      d.writeln('</tr>');
   }
   d.writeln('');
   d.writeln('<tr><td class="light_gray_cell" style="font-size: 16pt; vertical-align: top; height:100%; border-right: solid 1px black; border-bottom: solid 1px black" colspan=2>');
   d.writeln('');
   d.writeln('<form name=year_form>');
   d.writeln('');
   d.writeln('   <br><font style="font-size: 18pt;"><span style="vertical_align: bottom">Select Year:&nbsp&nbsp</span></font>');
   d.writeln('');
   d.writeln('   <select class="light_gray_background" style="font-size: 12pt; font-family: Calibri; border: 1px solid black; height: 25px" size=1 name=year_menu onChange="change_year(); return true;">');

   for (var i = max_archive_year; i >= min_archive_year; i--)
   {
      if (i == archive_year)
      {
         d.writeln('      <option selected value="'+i+'">'+i+'');
      }
      else
      {
         d.writeln('      <option          value="'+i+'">'+i+'');
      }
   }
   d.writeln('   </select>');
   d.writeln('');
   d.writeln('   <br><a class="blue_link" name=no_right_click href=javascript:open_results_window();><br>'+archive_year+' Results</a>');
   d.writeln('');
   if (archive_year > 2001)
   {
      d.writeln('   <br><br><a class="blue_link" name=no_right_click href=javascript:open_post_season_archive("summary_archive");>'+archive_year+' Post Season Summary</a>');
      d.writeln('');
      d.writeln('   <br><br><a class="blue_link" name=no_right_click href=javascript:open_regular_season_archive("summary_archive");>'+archive_year+' Regular Season Summary</a>');
      d.writeln('');
      d.writeln('   <br><br><a class="blue_link" name=no_right_click href=javascript:open_regular_season_archive("weekly_archive");>'+archive_year+' Regular Season Weekly Results</a>');
   }
   d.writeln('');
   d.writeln('</form>');
   d.writeln('');
   d.writeln('</td></tr>');
   d.writeln('');
   d.writeln('</table>');
   d.writeln('');
   d.writeln('');
   d.writeln('</body>');
   d.writeln('');
   d.writeln('</html>');

   d.close();

   return true;
}
