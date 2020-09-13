
function adjust_mobile_viewport_height(document)
{
   if ( (top.gv.mobile == true) && (navigator.platform != "iPad") )
   {
      if ( (window.screen.height > window.screen.width) && (top.document.getElementById("viewport") != null) )
      {
         var document_height  = document.body.scrollHeight;
         var viewport_scale   = window.screen.height/document_height;
         var viewport_content = "height=" + document_height + "px, initial-scale=" + viewport_scale;

         top.document.getElementById("viewport").setAttribute("content",viewport_content);
      }
   }

   return;
}


function build_post_season_form()
{
   if (check_for_opener() == false)
   {
      window.top.close();

      return false;
   }

   var bullet_color                  = "";
   var color_black                   = "black";
   var color_red                     = "red";
   var current_prelim_week           = false;
   var document_heading              = "";
   var home_team_possession_flag     = "";
   var input_field_size              = 1;
   var input_tag_style               = "";
   var mode                          = window.top.gv.mode;
   var mode_string                   = "";
   var number_of_rs_weeks            = window.top.gv.number_of_rs_weeks;
   var victors                       = "";
   var visiting_team_possession_flag = "";
   var week                          = window.top.gv.current_input_week - number_of_rs_weeks;

   var decimal_count      = window.top.gv.decimal_count;
   var number_of_ps_games = window.top.gv.number_of_ps_games;
   var w1_start           = window.top.gv.w1_start;
   var w1_end             = window.top.gv.w1_end;
   var w2_start           = window.top.gv.w2_start;
   var w2_end             = window.top.gv.w2_end;
   var w3_start           = window.top.gv.w3_start;
   var w3_end             = window.top.gv.w3_end;
   var w4_start           = window.top.gv.w4_start;
   var w4_end             = window.top.gv.w4_end;

   if (mode == "prelim")
   {
      mode_string                  = "Preliminary";
      post_season_possession_teams = window.top.gv.post_season_possession_teams;
      post_season_red_zone_flags   = window.top.gv.post_season_red_zone_flags;
      victors                      = window.top.gv.post_season_victors;
      week                         = week - 1;
   }
   else if (mode == "final")
   {
      mode_string = "Final";
      week        = week - 2;

      if (window.top.gv.games_over == true) week = week + 1;
   }
   else if (mode == "summary_archive")
   {
      mode_string = "Final";
      week        = 4;
   }

   if (week < 1) week = 1;
   if (week > 4) week = 4;

   if (post_season_winners.length == 11)
   {
      decimal_count      = 0;
      number_of_ps_games = 11;
      w1_start           = 1;
      w1_end             = 4;
      w2_start           = 5;
      w2_end             = 8;
      w3_start           = 9;
      w3_end             = 10;
      w4_start           = 11;
      w4_end             = 11;
   }
 
   // Force this week's visitor and home scores to be zero if the mode is preliminary.

   for (var gi = 1; gi <= number_of_ps_games; gi++)
   {
      if ( ( (week == 1) && (mode == "prelim") && (gi >= w1_start && gi <= w1_end) ) ||
           ( (week == 2) && (mode == "prelim") && (gi >= w2_start && gi <= w2_end) ) ||
           ( (week == 3) && (mode == "prelim") && (gi >= w3_start && gi <= w3_end) ) ||
           ( (week == 4) && (mode == "prelim") && (gi >= w4_start && gi <= w4_end) )    )
      {
         excel_visitor_scores[gi-1] = "";
         excel_home_scores[gi-1]    = "";
      }
   }

   // Initialize the visitor and home scores global arrays from the excel data.

   if (window.top.gv.scores_already_assigned == false)
   {
      window.top.gv.home_scores             = excel_home_scores;
      window.top.gv.visitor_scores          = excel_visitor_scores;
      window.top.gv.scores_already_assigned = true;
   }

   // Now define a host of variables and arrays needed to build the form.

   var number_of_ps_players      = window.top.gv.ps_players.length;

   var adjusted_score            = 0;
   var best_player_win_count     = 0;
   var best_total_points_count   = 0;
   var best_total_points_score   = null_score;
   var border_style              = "no_border";
   var current_week_scores       = 0;
   var form_view                 = window.top.gv.form_view;
   var game_state                = "at";
   var heading_colspan           = 53;
   var high_score_count          = 0;
   var high_score_players        = Array(number_of_ps_players).fill(null);
   var home_scores               = window.top.gv.home_scores;
   var null_score                = 9999;
   var order_by                  = window.top.gv.order_by;
   var overall_ranks             = Array(number_of_ps_players).fill(1);
   var overall_scores            = Array(number_of_ps_players).fill(null_score);
   var percent_wins              = "";
   var player_colspan            = 4;
   var player_index              = Array(number_of_ps_players).fill().map((_,i) => i);  // Sets player_index = [0,1,2,3,4,5,6,7,8,9,10,11]
   var player_pick_valid         = true;
   var player_win_count          = Array(number_of_ps_players).fill(0);
   var points                    = "";
   var possible_win_count        = 0;
   var ps_players                = window.top.gv.ps_players;
   var sorted_overall_scores     = Array(number_of_ps_players).fill(null_score);
   var sorted_week_1_scores      = Array(number_of_ps_players).fill(null_score);
   var sorted_week_2_scores      = Array(number_of_ps_players).fill(null_score);
   var sorted_week_3_scores      = Array(number_of_ps_players).fill(null_score);
   var sorted_week_4_scores      = Array(number_of_ps_players).fill(null_score);
   var td_background             = "";
   var total_points              = "";
   var total_points_game_index   = -1;
   var total_points_score        = "<br>";
   var total_points_scores       = Array(number_of_ps_players).fill(null_score);
   var use_player_points         = true;
   var visitor_scores            = window.top.gv.visitor_scores;
   var week_1_high_score_count   = 0;
   var week_1_high_score_players = Array(number_of_ps_players).fill(null);
   var week_1_ranks              = Array(number_of_ps_players).fill(1);
   var week_1_scores             = Array(number_of_ps_players).fill(null_score);
   var week_1_valid_game_cnt     = 4;
   var week_2_high_score_count   = 0;
   var week_2_high_score_players = Array(number_of_ps_players).fill(null);
   var week_2_ranks              = Array(number_of_ps_players).fill(1);
   var week_2_scores             = Array(number_of_ps_players).fill(null_score);
   var week_2_valid_game_cnt     = 4;
   var week_3_high_score_count   = 0;
   var week_3_high_score_players = Array(number_of_ps_players).fill(null);
   var week_3_ranks              = Array(number_of_ps_players).fill(1);
   var week_3_scores             = Array(number_of_ps_players).fill(null_score);
   var week_3_valid_game_cnt     = 2;
   var week_4_high_score_count   = 0;
   var week_4_high_score_players = Array(number_of_ps_players).fill(null);
   var week_4_ranks              = Array(number_of_ps_players).fill(1);
   var week_4_scores             = Array(number_of_ps_players).fill(null_score);
   var week_4_valid_game_cnt     = 1;

   // Only use player points as a tie breaker if the player_points array exists.

   if (typeof player_points == "undefined") use_player_points = false;

   // Set column spans for expanded or compact view.

   if (form_view == "expanded")
   {
      player_colspan  = 4;
   }
   else
   {
      player_colspan  = 1;
   }

   heading_colspan = (number_of_ps_players * player_colspan) + 5;

   // Build document heading.

   if (mode == "prelim")
   {
      document_heading = "Post Season - Week " + week + " Preliminary";
   }
   else if (mode == "final")
   {
      document_heading = "Post Season - Week " + week + " Final";
   }
   else if (mode == "summary_archive")
   {
      document_heading = window.top.gv.archive_year + " Post Season Summary";
   }

   // Calculate the post season winners and margins of victory.

   for (var gi = 1; gi <= number_of_ps_games; gi++)
   {
      // Force visiting team names, home team names, player picks,
      // players spreads, and player points to be blank for future weeks.

      if ( ( (week ==  1) && (gi > w1_end) ) ||
           ( (week ==  2) && (gi > w2_end) ) ||
           ( (week ==  3) && (gi > w3_end) ) ||
           ( (week ==  4) && (gi > w4_end) )    )
      {
         visiting_teams[gi-1] = "";
         home_teams[gi-1]     = "";

         for (var pi = 1; pi <= number_of_ps_players; pi++)
         {
            player_picks[pi-1][gi-1]   = "";
            player_spreads[pi-1][gi-1] = "";

            if (use_player_points == true) player_points[pi-1][gi-1]  = "";
         }
      }

      // Force all post season game attributes to be blank if at least one attribute is invalid.
        
      if ( (isNaN(visitor_scores[gi-1]) == true) ||
           (isNaN(home_scores[gi-1])    == true) ||
           (visiting_teams[gi-1]        ==   "") ||
           (home_teams[gi-1]            ==   "")    )
      {
         visitor_scores[gi-1] = "<br>";
         home_scores[gi-1]    = "<br>";
         visiting_teams[gi-1] = "<br>";
         home_teams[gi-1]     = "<br>";

         if ( (gi >= w1_start) && (gi <= w1_end) ) week_1_valid_game_cnt--;
         if ( (gi >= w2_start) && (gi <= w2_end) ) week_2_valid_game_cnt--;
         if ( (gi >= w3_start) && (gi <= w3_end) ) week_3_valid_game_cnt--;
         if ( (gi >= w4_start) && (gi <= w4_end) ) week_4_valid_game_cnt--;
      }
      else
      {
         // All post season game attributes are valid, so make sure visitor and home scores are integers.

         visitor_scores[gi-1] = visitor_scores[gi-1] - 0;
         home_scores[gi-1]    = home_scores[gi-1]    - 0;
      }

      // Calculate the post season game winner (V or H).

      post_season_winners[gi-1] = "";

      if (visitor_scores[gi-1] > home_scores[gi-1])
      {
         post_season_winners[gi-1] = "V";
      }
      else if (home_scores[gi-1] > visitor_scores[gi-1])
      {
         post_season_winners[gi-1] = "H";
      }

      // Calculate the post season game spread (margin of victory).

      winner_spreads[gi-1] = Math.abs(visitor_scores[gi-1]-home_scores[gi-1]);

      if (winner_spreads[gi-1] == 0)           winner_spreads[gi-1] = "";
      if (isNaN(winner_spreads[gi-1]) == true) winner_spreads[gi-1] = "";
   }

   // Calculate the player scores.

   for (var pi = 1; pi <= number_of_ps_players; pi++)
   {
      current_week_scores  = 0;
      overall_scores[pi-1] = 0;
      possible_win_count   = 0;
      week_1_scores[pi-1]  = 0;
      week_2_scores[pi-1]  = 0;
      week_3_scores[pi-1]  = 0;
      week_4_scores[pi-1]  = 0;

      for (var gi = 1; gi <= number_of_ps_games; gi++)
      {
         // Check to see if the player pick (H or V), player spread (margin of victory),
         // and player points (total points prediction for final game of the week) are valid.

         player_pick_valid = true;

         if ( (player_picks[pi-1][gi-1] != "V") && (player_picks[pi-1][gi-1] != "H") )
         {
            player_picks[pi-1][gi-1]   = "<br>";
            player_spreads[pi-1][gi-1] = "<br>";

            if (use_player_points == true) player_points[pi-1][gi-1]  = "<br>";

            player_scores[pi-1][gi-1]  = "<br>";
            player_pick_valid          = false;
            current_week_scores        = null_score;
         }

         if ( (player_spreads[pi-1][gi-1] == "") || (isNaN(player_spreads[pi-1][gi-1]) == true) )
         {
            player_picks[pi-1][gi-1]   = "<br>";
            player_spreads[pi-1][gi-1] = "<br>";

            if (use_player_points == true) player_points[pi-1][gi-1]  = "<br>";

            player_scores[pi-1][gi-1]  = "<br>";
            player_pick_valid          = false;
            current_week_scores        = null_score;
         }
         else
         {
            // Player pick and spread are valid, so make sure the player spread and the player points are integers.

            player_spreads[pi-1][gi-1] = player_spreads[pi-1][gi-1] - 0;

            if (use_player_points == true) player_points[pi-1][gi-1] = player_points[pi-1][gi-1] - 0;
         }

         // Check to see if there is a winner for this post season game and if the player pick is valid.

         if ( (post_season_winners[gi-1] == "V") || (post_season_winners[gi-1] == "H") )
         {
            possible_win_count += 1;

            if (player_pick_valid == true)
            {
               // Calculate the player score for this post season game.

               if (player_picks[pi-1][gi-1] == post_season_winners[gi-1])
               {
                  player_scores[pi-1][gi-1] = Math.abs(player_spreads[pi-1][gi-1]-winner_spreads[gi-1]);
                  player_win_count[pi-1]   += 1;
               }
               else
               {
                  player_scores[pi-1][gi-1] = Math.abs(player_spreads[pi-1][gi-1]+winner_spreads[gi-1]) + wrong_pick_penalty;
               }

               // Only add the player score for this post season game if the player
               // score for the previous post season games in the same week are valid.

               if (current_week_scores != null_score)
               {
                  current_week_scores = current_week_scores + player_scores[pi-1][gi-1];
               }
            }
            else
            {
               // Since one player score for this post season week is invalid,
               // then the combined score for the post season week is also invalid.

               current_week_scores = null_score;
            }
         }
         else
         {
            // There is no winner for the post season game, so set the player score to blank.

            player_scores[pi-1][gi-1] = "<br>";
         }

         // If a player's combined score for a post season week is valid, then multiply it
         // by the post season week multiplier and add it to the player's overall score.

         if (gi == w1_end)
         {
            week_1_scores[pi-1] = current_week_scores;

            if (week_1_scores[pi-1] != null_score) 
            {
               adjusted_score = (week_1_scores[pi-1] * week_1_score_multiplier) - week_1_scores[pi-1];
               week_1_scores[pi-1]  = week_1_scores[pi-1] + adjusted_score;
               overall_scores[pi-1] = overall_scores[pi-1] + week_1_scores[pi-1];
            }

            // Reset the current week scores for the next week.

            current_week_scores = 0;
         }

         if (gi == w2_end)
         {
            week_2_scores[pi-1] = current_week_scores;

            if (week_2_scores[pi-1] != null_score) 
            {
               adjusted_score = (week_2_scores[pi-1] * week_2_score_multiplier) - week_2_scores[pi-1];
               week_2_scores[pi-1]  = week_2_scores[pi-1] + adjusted_score;
               overall_scores[pi-1] = overall_scores[pi-1] + week_2_scores[pi-1];
            }

            // Reset the current week scores for the next week.

            current_week_scores = 0;
         }

         if (gi == w3_end)
         {
            week_3_scores[pi-1] = current_week_scores;

            if (week_3_scores[pi-1] != null_score) 
            {
               adjusted_score = (week_3_scores[pi-1] * week_3_score_multiplier) - week_3_scores[pi-1];
               week_3_scores[pi-1]  = week_3_scores[pi-1] + adjusted_score;
               overall_scores[pi-1] = overall_scores[pi-1] + week_3_scores[pi-1];
            }

            // Reset the current week scores for the next week.

            current_week_scores = 0;
         }

         if (gi == w4_end)
         {
            week_4_scores[pi-1] = current_week_scores;

            if (week_4_scores[pi-1] != null_score) 
            {
               adjusted_score = (week_4_scores[pi-1] * week_4_score_multiplier) - week_4_scores[pi-1];
               week_4_scores[pi-1]  = week_4_scores[pi-1] + adjusted_score;
               overall_scores[pi-1] = overall_scores[pi-1] + week_4_scores[pi-1];
            }

            // Reset the current week scores for the next week.

            current_week_scores = 0;
         }
      }

      // If a player's score for a post season week is invalid and there is at least one
      // post season game winner for that week, then the player's overall is set to invalid.

      if ( (week_1_scores[pi-1] == null_score) && (week_1_valid_game_cnt > 0) )
      {
         overall_scores[pi-1] = null_score;
      }

      if ( (week_2_scores[pi-1] == null_score) && (week_2_valid_game_cnt > 0) )
      {
         overall_scores[pi-1] = null_score;
      }

      if ( (week_3_scores[pi-1] == null_score) && (week_3_valid_game_cnt > 0) )
      {
         overall_scores[pi-1] = null_score;
      }

      if ( (week_4_scores[pi-1] == null_score) && (week_4_valid_game_cnt > 0) )
      {
         overall_scores[pi-1] = null_score;
      }
   }

   // Sort scores and determine best player win count.

   best_player_win_count = 0;

   for (var pi = 1; pi <= number_of_ps_players; pi++)
   {
      sorted_overall_scores[pi-1] = overall_scores[pi-1];
      sorted_week_1_scores[pi-1]  = week_1_scores[pi-1];
      sorted_week_2_scores[pi-1]  = week_2_scores[pi-1];
      sorted_week_3_scores[pi-1]  = week_3_scores[pi-1];
      sorted_week_4_scores[pi-1]  = week_4_scores[pi-1];

      if (player_win_count[pi-1] > best_player_win_count) best_player_win_count = player_win_count[pi-1];
   }

   sorted_overall_scores.sort(function(sorted_overall_scores,b){return sorted_overall_scores-b;});
   sorted_week_1_scores.sort(function(sorted_week_1_scores,b){return sorted_week_1_scores-b;});
   sorted_week_2_scores.sort(function(sorted_week_2_scores,b){return sorted_week_2_scores-b;});
   sorted_week_3_scores.sort(function(sorted_week_3_scores,b){return sorted_week_3_scores-b;});
   sorted_week_4_scores.sort(function(sorted_week_4_scores,b){return sorted_week_4_scores-b;});

   // Determine the player rankings.

   for (var pi = 1; pi <= number_of_ps_players; pi++)
   {
      // Determine the player rankings for week 1.

      for (var pii = 1; pii <= number_of_ps_players; pii++)
      {
         if (week_1_scores[pi-1] == sorted_week_1_scores[pii-1])
         {
            week_1_ranks[pi-1] = pii;

            if (pii == 1)
            {
               // If the current player has a high score, save the current
               // player's index and increment the high score count.

               week_1_high_score_players[week_1_high_score_count] = pi-1;
               week_1_high_score_count++;
            }
            break;
         }
      }

      // Determine the player rankings for week 2.

      for (var pii = 1; pii <= number_of_ps_players; pii++)
      {
         if (week_2_scores[pi-1] == sorted_week_2_scores[pii-1])
         {
            week_2_ranks[pi-1] = pii;

            if (pii == 1)
            {
               // If the current player has a high score, save the current
               // player's index and increment the high score count.

               week_2_high_score_players[week_2_high_score_count] = pi-1;
               week_2_high_score_count++;
            }
            break;
         }
      }

      // Determine the player rankings for week 3.

      for (var pii = 1; pii <= number_of_ps_players; pii++)
      {
         if (week_3_scores[pi-1] == sorted_week_3_scores[pii-1])
         {
            week_3_ranks[pi-1] = pii;

            if (pii == 1)
            {
               // If the current player has a high score, save the current
               // player's index and increment the high score count.

               week_3_high_score_players[week_3_high_score_count] = pi-1;
               week_3_high_score_count++;
            }
            break;
         }
      }

      // Determine the player rankings for week 4.

      for (var pii = 1; pii <= number_of_ps_players; pii++)
      {
         if (week_4_scores[pi-1] == sorted_week_4_scores[pii-1])
         {
            week_4_ranks[pi-1] = pii;

            if (pii == 1)
            {
               // If the current player has a high score, save the current
               // player's index and increment the high score count.

               week_4_high_score_players[week_4_high_score_count] = pi-1;
               week_4_high_score_count++;
            }
            break;
         }
      }

      // Determine the player rankings based on the overall scores.

      for (var pii = 1; pii <= number_of_ps_players; pii++)
      {
         if (overall_scores[pi-1] == sorted_overall_scores[pii-1])
         {
            overall_ranks[pi-1] = pii;
            break;
         }
      }
   }

   // If this is a footall pool year that has the post season tie breaker in place,
   // then use the total points predictions to break any ties that my exist.

   if (use_player_points == true)
   {
      for (var post_season_week = 1; post_season_week <= 4; post_season_week++)
      {
         if (post_season_week == 1)
         {
            high_score_count        = week_1_high_score_count;
            high_score_players      = week_1_high_score_players;
            total_points_game_index = w1_end-1;
         }

         if (post_season_week == 2)
         {
            high_score_count        = week_2_high_score_count;
            high_score_players      = week_2_high_score_players;
            total_points_game_index = w2_end-1;
         }

         if (post_season_week == 3)
         {
            high_score_count        = week_3_high_score_count;
            high_score_players      = week_3_high_score_players;
            total_points_game_index = w3_end-1;
         }

         if (post_season_week == 4)
         {
            high_score_count        = week_4_high_score_count;
            high_score_players      = week_4_high_score_players;
            total_points_game_index = w4_end-1;
         }

         // Calcuate the total points of the last game played in this week.

         total_points = visitor_scores[total_points_game_index] + home_scores[total_points_game_index];

         // If scores exist for the last game of this week and if more than one
         // player has the high score for this week, then we need to break the tie.

         if ( (total_points > 0) && (high_score_count > 1) )
         {
            // Calculate the total points score for each player that has a high score this week.

            for (var index = 1; index <= high_score_count; index++)
            {
               // If the current player that has a high score didn't submit a total points prediction, then
               // assign the player a null_score which will effectively eliminate the player from being ranked 1.

               if (player_points[high_score_players[index-1]][total_points_game_index] == 0)
               {
                  player_points[high_score_players[index-1]][total_points_game_index] = null_score;
               }

               // Calculate the difference between the actual total points and the current players predicted total points.

               total_points_scores[high_score_players[index-1]] = total_points - player_points[high_score_players[index-1]][total_points_game_index];

               // If the total points score is negative, this means the current player's total points prediction
               // exceeded the actual total points.  In this case, penalize the player by a tenth of a point in
               // case another player has the same total points score but did not exceed the actual total points.

               if (total_points_scores[high_score_players[index-1]] < 0 )
               {
                  total_points_scores[high_score_players[index-1]] = total_points_scores[high_score_players[index-1]] - .1;
               }

               // Calculate the absolute value of the total points score.

               total_points_scores[high_score_players[index-1]] = Math.abs(total_points_scores[high_score_players[index-1]]);
            }

            // Determine the best total points score.  Those players that don't have the
            // high score for this week have been assigned a total point score of null_score.

            best_total_points_score = null_score;

            for (var pi = 1; pi <= number_of_ps_players; pi++)
            {
               if (total_points_scores[pi-1] < best_total_points_score)
               {
                  best_total_points_score = total_points_scores[pi-1];
               }
            }

            // Adjust the rank of each player that has a high score for this week but not the best total points score.

            best_total_points_count = 0;

            for (var pi = 1; pi <= number_of_ps_players; pi++)
            {
               if (total_points_scores[pi-1] == best_total_points_score) best_total_points_count++;
            }

            for (var pi = 1; pi <= number_of_ps_players; pi++)
            {
               if (post_season_week == 1)
               {
                  if ( (week_1_ranks[pi-1] == 1) && (total_points_scores[pi-1] != best_total_points_score) )
                  {
                     week_1_ranks[pi-1] = 1 + best_total_points_count;
                  }
               }

               if (post_season_week == 2)
               {
                  if ( (week_2_ranks[pi-1] == 1) && (total_points_scores[pi-1] != best_total_points_score) )
                  {
                     week_2_ranks[pi-1] = 1 + best_total_points_count;
                  }
               }

               if (post_season_week == 3)
               {
                  if ( (week_3_ranks[pi-1] == 1) && (total_points_scores[pi-1] != best_total_points_score) )
                  {
                     week_3_ranks[pi-1] = 1 + best_total_points_count;
                  }
               }

               if (post_season_week == 4)
               {
                  if ( (week_4_ranks[pi-1] == 1) && (total_points_scores[pi-1] != best_total_points_score) )
                  {
                     week_4_ranks[pi-1] = 1 + best_total_points_count;
                  }
               }

               // If the current player was assigned a null_score because the total points prediction was not
               // submitted, then undo the null_score assignment in order to suppress the player points display.

               if (player_points[pi-1][total_points_game_index] == null_score)
               {
                  player_points[pi-1][total_points_game_index] = "<br>";
               }
            }
         }

         // Re-initialize total_points_scores for the next for loop iteration.

         total_points_scores.fill(null_score);
      }
   }

   // Calculate player index for order by players or scores

   for (var pi = 1; pi <= number_of_ps_players; pi++)
   {
      if (order_by == "players")
      {
         player_index[pi-1] = pi-1;
      }
      else
      {
         var order_by_ranks = overall_ranks;

         if (order_by ==  "week_1_scores") order_by_ranks = week_1_ranks;
         if (order_by ==  "week_2_scores") order_by_ranks = week_2_ranks;
         if (order_by ==  "week_3_scores") order_by_ranks = week_3_ranks;
         if (order_by ==  "week_4_scores") order_by_ranks = week_4_ranks;
         if (order_by == "overall_scores") order_by_ranks = overall_ranks;
         
         duplicates = 0;

         for (var pii = 1; pii <= number_of_ps_players; pii++)
         {
            if (pi == order_by_ranks[pii-1])
            {
               player_index[(pi+duplicates)-1] = pii-1;

               duplicates++;
            }
         }

         pi = pi + duplicates - 1;
      }
   }

   document.open();

   var d = document;

   d.writeln('<html>');
   d.writeln('');

   d.writeln('<head>');
   d.writeln('   <title>NFL Football Pool</title>');
   d.writeln('   <style type="text/css">');
   d.writeln('   <!--');
   d.writeln('      TD              {border-style:        solid;');
   d.writeln('                       border-color:    lightgray;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .b3_border      {border: 3px solid    black}');
   d.writeln('      .bb1_border     {border-style:        solid;');
   d.writeln('                       border-color:        black;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .bb2_border     {border-style:        solid;');
   d.writeln('                       border-color:        black;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   2px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .br2_border     {border-style:        solid;');
   d.writeln('                       border-color:        black;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .br2_bb1_border {border-style:        solid;');
   d.writeln('                       border-color: white black black white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .br2_bb2_border {border-style:        solid;');
   d.writeln('                       border-color: white black black white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   2px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .br2_gb1_border {border-style:        solid;');
   d.writeln('                       border-color: white black lightgray white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gb1_border     {border-style:        solid;');
   d.writeln('                       border-color:    lightgray;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gr1_border     {border-style:        solid;');
   d.writeln('                       border-color:    lightgray;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gr1_bb1_border {border-style:        solid;');
   d.writeln('                       border-color: white lightgray black white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gr1_bb2_border {border-style:        solid;');
   d.writeln('                       border-color: white lightgray black white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   2px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gr1_gb1_border {border-style:        solid;');
   d.writeln('                       border-color: white lightgray lightgray white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .no_border      {border-style:        solid;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('   -->');
   d.writeln('   </style>');
   d.writeln('</head>');
   d.writeln('');

   d.writeln('<body>');
   d.writeln('');
   d.writeln('');

   d.writeln('<script language="JavaScript">');
   d.writeln('');

   d.writeln('function calculate_post_season_scores(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   clear_get_scores_data();');
   d.writeln('');
   d.writeln('   var error_message  = "Invalid input.\\n\\nEnter a number between 0 and 99 for the ";');
   d.writeln('   var select_element = "";');
   d.writeln('   var input_score    = 0;');
   d.writeln('   var scores         = document.fp_scores;');
   d.writeln('   var team           = "";');
   d.writeln('');
   d.writeln('');
   d.writeln('   for (var ei = 0; ei < scores.elements.length; ei++)');
   d.writeln('   {');
   d.writeln('      for (var gi = 1; gi <= '+number_of_ps_games+'; gi++)');
   d.writeln('      {');
   d.writeln('         if (scores.elements[ei].name == "visitor"+gi+"_score")');
   d.writeln('         {');
   d.writeln('            input_score = scores.elements[ei].value;');
   d.writeln('');
   d.writeln('            if (isNaN(input_score) == true)');
   d.writeln('            {');
   d.writeln('               if (team == "")');
   d.writeln('               {');
   d.writeln('                  select_element = scores.elements[ei];');
   d.writeln('                  team           = visiting_teams[gi-1];');
   d.writeln('               }');
   d.writeln('            }');
   d.writeln('            else');
   d.writeln('            {');
   d.writeln('               input_score = input_score - 0;');
   d.writeln('');
   d.writeln('               if ( (input_score < 0) || (input_score > 99) )');
   d.writeln('               {');
   d.writeln('                  if (team == "")');
   d.writeln('                  {');
   d.writeln('                     select_element = scores.elements[ei];');
   d.writeln('                     team           = visiting_teams[gi-1];');
   d.writeln('                  }');
   d.writeln('               }');
   d.writeln('               else');
   d.writeln('               {');
   d.writeln('                  window.top.gv.visitor_scores[gi-1] = input_score;');
   d.writeln('               }');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('');
   d.writeln('         if (scores.elements[ei].name == "home"+gi+"_score")');
   d.writeln('         {');
   d.writeln('            input_score = scores.elements[ei].value;');
   d.writeln('');
   d.writeln('            if (isNaN(input_score) == true)');
   d.writeln('            {');
   d.writeln('               if (team == "")');
   d.writeln('               {');
   d.writeln('                  select_element = scores.elements[ei];');
   d.writeln('                  team           = home_teams[gi-1];');
   d.writeln('               }');
   d.writeln('            }');
   d.writeln('            else');
   d.writeln('            {');
   d.writeln('               input_score = input_score - 0;');
   d.writeln('');
   d.writeln('               if ( (input_score < 0) || (input_score > 99) )');
   d.writeln('               {');
   d.writeln('                  if (team == "")');
   d.writeln('                  {');
   d.writeln('                     select_element = scores.elements[ei];');
   d.writeln('                     team           = home_teams[gi-1];');
   d.writeln('                  }');
   d.writeln('               }');
   d.writeln('               else');
   d.writeln('               {');
   d.writeln('                  window.top.gv.home_scores[gi-1] = input_score;');
   d.writeln('               }');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (team != "")');
   d.writeln('   {');
   d.writeln('      alert(error_message+team+" score.");');
   d.writeln('      select_element.select();');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   document.location.href = "fp_post_season_form.html";');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function change_order(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   var order_by_menu = document.fp_scores.order_by_menu;');
   d.writeln('   var menu_index    = order_by_menu.selectedIndex;');
   d.writeln('');
   d.writeln('');
   d.writeln('   window.top.gv.order_by = order_by_menu.options[menu_index].value;');
   d.writeln('');
   d.writeln('   if (window.top.gv.mode == "summary_archive")');
   d.writeln('   {');
   d.writeln('      document.location.href = "fp_forms_"+window.top.gv.archive_year+".html";');
   d.writeln('   }');
   d.writeln('   else');
   d.writeln('   {');
   d.writeln('      var refresh_scores = window.top.gv.refresh_scores;'); // Need to save refresh_scores because "clear_get_scores_data" will reset it.
   d.writeln('');
   d.writeln('      clear_get_scores_data();');
   d.writeln('');
   d.writeln('      if (window.top.gv.get_scores_state == "on" && refresh_scores == true)');
   d.writeln('      {');
   d.writeln('         get_nfl_scores(document,false,"");');
   d.writeln('      }');
   d.writeln('      else');
   d.writeln('      {');
   d.writeln('         document.location.href = "fp_post_season_form.html";');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function change_view(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (window.top.gv.form_view == "expanded")');
   d.writeln('   {');
   d.writeln('      window.top.gv.form_view = "compact";');
   d.writeln('   }');
   d.writeln('   else if (window.top.gv.form_view == "compact")');
   d.writeln('   {');
   d.writeln('      window.top.gv.form_view = "expanded";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (window.top.gv.mode == "summary_archive")');
   d.writeln('   {');
   d.writeln('      document.location.href = "fp_forms_"+window.top.gv.archive_year+".html";');
   d.writeln('   }');
   d.writeln('   else');
   d.writeln('   {');
   d.writeln('      var refresh_scores = window.top.gv.refresh_scores;'); // Need to save refresh_scores because "clear_get_scores_data" will reset it.
   d.writeln('');
   d.writeln('      clear_get_scores_data();');
   d.writeln('');
   d.writeln('      if (window.top.gv.get_scores_state == "on" && refresh_scores == true)');
   d.writeln('      {');
   d.writeln('         get_nfl_scores(document,false,"");');
   d.writeln('      }');
   d.writeln('      else');
   d.writeln('      {');
   d.writeln('         document.location.href = "fp_post_season_form.html";');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function clear_get_scores_data()');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Clear information set by "Get NFL Scores".');
   d.writeln('');
   d.writeln('   for (var i = 0; i < '+number_of_ps_games+'; i++)');
   d.writeln('   {');
   d.writeln('      window.top.gv.post_season_game_states[i]      = "at";');
   d.writeln('      window.top.gv.post_season_possession_teams[i] = "";');
   d.writeln('      window.top.gv.post_season_red_zone_flags[i]   = false;');
   d.writeln('      window.top.gv.post_season_victors[i]          = "";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   window.top.gv.refresh_scores = false;');
   d.writeln('');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function clear_scores(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   clear_get_scores_data();');
   d.writeln('');
   d.writeln('   window.top.gv.scores_already_assigned = false;');
   d.writeln('');
   d.writeln('   document.location.href = "fp_post_season_form.html";');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function get_nfl_scores(document,display_dialog,command)');
   d.writeln('{');
   d.writeln('   var nfl_connection = null;');
   d.writeln('   var nfl_scores     = null;');
   d.writeln('   var nfl_scores_url = "www.nfl.com/liveupdate/scores/scores.json";');
   d.writeln('   var request_url    = "https://www.scrappintwins.com/cors/" + nfl_scores_url + "?" + (new Date()).getTime();'); // scrappintwins.com provided by Dan M.
   d.writeln('   var user_message   = "\\"Get NFL Scores\\" failed.";');
   d.writeln('');
   d.writeln('');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (window.top.gv.get_scores_state == "on") user_message += "  \\"Auto Refresh\\" will be stopped."');
   d.writeln('');
   d.writeln('   // Attempt to get the NFL scores from the internet.');
   d.writeln('');
   d.writeln('   nfl_connection = new XMLHttpRequest();');
   d.writeln('');
   d.writeln('   nfl_connection.open("GET",request_url,true);');
   d.writeln('');
   d.writeln('   nfl_connection.onload = function(e)');
   d.writeln('   {');
   d.writeln('      if (nfl_connection.readyState === 4) // Is XMLHttpRequest complete?');
   d.writeln('      {');
   d.writeln('         if (nfl_connection.status === 200) // Was the XMLHttpRequest successful?');
   d.writeln('         {');
   d.writeln('            nfl_scores = nfl_connection.responseText;');
   d.writeln('');
   d.writeln('            process_nfl_scores(document,display_dialog,command,nfl_scores);')
   d.writeln('         }')
   d.writeln('         else // XMLHttpRequest was unsuccessful.')
   d.writeln('         {')
   d.writeln('            alert(user_message);');
   d.writeln('');
   d.writeln('            // Force Auto Refresh to be off and refresh the preliminary form.');
   d.writeln('');
   d.writeln('            get_scores_auto_refresh(document,"stop");');
   d.writeln('');
   d.writeln('            document.location.href="fp_post_season_form.html";');
   d.writeln('         }')
   d.writeln('      }')
   d.writeln('');
   d.writeln('      return;');
   d.writeln('   }')
   d.writeln('');
   d.writeln('   nfl_connection.onerror = function(e)')
   d.writeln('   {')
   d.writeln('      alert(user_message);');
   d.writeln('');
   d.writeln('      // Force Auto Refresh to be off and refresh the preliminary form.');
   d.writeln('');
   d.writeln('      get_scores_auto_refresh(document,"stop");');
   d.writeln('');
   d.writeln('      document.location.href="fp_post_season_form.html";');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   };')
   d.writeln('')
   d.writeln('   nfl_connection.send(null);')
   d.writeln('');
   d.writeln('   return;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function get_scores_auto_refresh(document,command)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   clear_get_scores_data();');
   d.writeln('');
   d.writeln('   if (command == "start")');
   d.writeln('   {');
   d.writeln('      if (window.top.gv.get_scores_state == "off")');
   d.writeln('      {');
   d.writeln('         window.top.gv.get_scores_state = "on";');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('   else  // command must equal "stop".');
   d.writeln('   {;');
   d.writeln('      if (window.top.gv.get_scores_state == "on")');
   d.writeln('      {');
   d.writeln('         clearInterval(window.top.gv.get_scores_timer);');
   d.writeln('');
   d.writeln('         window.top.gv.get_scores_state = "off";');
   d.writeln('         window.top.gv.get_scores_timer = null;');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function process_nfl_scores(document,display_dialog,command,nfl_scores)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   clear_get_scores_data();');
   d.writeln('');
   d.writeln('   window.top.gv.refresh_scores = true;');
   d.writeln('');
   d.writeln('   var down                        = "";');
   d.writeln('   var game                        = "";');
   d.writeln('   var game_clock_integer          = "";');
   d.writeln('   var game_clock_string           = "";');
   d.writeln('   var game_key                    = "";');
   d.writeln('   var game_list                   = "";');
   d.writeln('   var game_state                  = "";');
   d.writeln('   var game_status                 = "game_not_started";');
   d.writeln('   var game_valid                  = false;');
   d.writeln('   var games_in_progress           = false;');
   d.writeln('   var home_score                  = "";');
   d.writeln('   var home_team                   = "";');
   d.writeln('   var nfl_team_city_abbreviations = ["ARI",      "ATL",    "BAL",   "BUF",  "CAR",     "CHI",  "CIN",    "CLE",   "DAL",    "DEN",    "DET",  "GB",     "HOU",   "IND",  "JAC",    "KC",    "LA",  "LAC",     "MIA",     "MIN",    "NE",      "NO",    "NYG",   "NYJ", "LV",     "PHI",   "PIT",     "SEA",     "SF",   "TB",        "TEN",   "WAS"          ];');
   d.writeln('   var nfl_team_names              = ["Cardinals","Falcons","Ravens","Bills","Panthers","Bears","Bengals","Browns","Cowboys","Broncos","Lions","Packers","Texans","Colts","Jaguars","Chiefs","Rams","Chargers","Dolphins","Vikings","Patriots","Saints","Giants","Jets","Raiders","Eagles","Steelers","Seahawks","49ers","Buccaneers","Titans","Football Team"];');
   d.writeln('   var possession_teams_index      = 0;');
   d.writeln('   var post_season_victors_index   = 0;');
   d.writeln('   var scores_index_start          = null;');
   d.writeln('   var scores_index_stop           = null;');
   d.writeln('   var temp_string                 = "";');
   d.writeln('   var user_message                = "";');
   d.writeln('   var visiting_score              = "";');
   d.writeln('   var visiting_team               = "";');
   d.writeln('   var week                        = window.top.gv.current_input_week-(window.top.gv.number_of_rs_weeks+1);');
   d.writeln('');
   d.writeln('');
   d.writeln('   if (command != "Start")');
   d.writeln('   {');
   d.writeln('      command = "Get NFL Scores";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (display_dialog == true)');
   d.writeln('   {');
   d.writeln('      user_message = "\\""+ command + "\\" will:\\n\\n";');
   d.writeln('      user_message = user_message + "   - Clear the scores on the Preliminary Form\\n";');
   d.writeln('      user_message = user_message + "   - Get all in-progress and final scores from the internet\\n";');
   d.writeln('      user_message = user_message + "   - Populate the Preliminary Form using the scores from the internet";');
   d.writeln('      if (command == "Start")');
   d.writeln('      {');
   d.writeln('         user_message = user_message + "\\n   - Automatically update the Preliminary Form every 10 seconds\\n";');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      if (confirm(user_message) == false) return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (week == 1)');
   d.writeln('   {');
   d.writeln('      scores_index_start = '+w1_start+'-1;');
   d.writeln('      scores_index_stop  = '+w1_end+'-1;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (week == 2)');
   d.writeln('   {');
   d.writeln('      scores_index_start = '+w2_start+'-1;');
   d.writeln('      scores_index_stop  = '+w2_end+'-1;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (week == 3)');
   d.writeln('   {');
   d.writeln('      scores_index_start = '+w3_start+'-1;');
   d.writeln('      scores_index_stop  = '+w3_end+'-1;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (week == 4)');
   d.writeln('   {');
   d.writeln('      scores_index_start = '+w4_start+'-1;');
   d.writeln('      scores_index_stop  = '+w4_end+'-1;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Create a JSON object from nfl_scores.');
   d.writeln('');
   d.writeln('   var game_list = JSON.parse(nfl_scores);');
   d.writeln('');
   d.writeln('   // Retrieve information for each game from game_list.');
   d.writeln('');
   d.writeln('   for (var i = 0; i < Object.keys(game_list).length; i++)');
   d.writeln('   {');
   d.writeln('      // Get the JSON object key of the current game.');
   d.writeln('');
   d.writeln('      game_key = Object.keys(game_list)[i];');
   d.writeln('');
   d.writeln('      // Get the current game pointer.');
   d.writeln('');
   d.writeln('      game = game_list[game_key];');
   d.writeln('');
   d.writeln('      // Save the team names and scores.');
   d.writeln('');
   d.writeln('      for (var k = 0; k < nfl_team_city_abbreviations.length; k++)');
   d.writeln('      {');
   d.writeln('         if (game.home.abbr == nfl_team_city_abbreviations[k]) home_team     = nfl_team_names[k];');
   d.writeln('         if (game.away.abbr == nfl_team_city_abbreviations[k]) visiting_team = nfl_team_names[k];');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      home_score     = game.home.score.T - 0;');
   d.writeln('      visiting_score = game.away.score.T - 0;');
   d.writeln('');
   d.writeln('      // If game is not valid, skip to the next game.');
   d.writeln('');
   d.writeln('      game_valid = false;');
   d.writeln('');
   d.writeln('      for (var j = scores_index_start; j <= scores_index_stop; j++)');
   d.writeln('      {');
   d.writeln('         if ( (home_team == home_teams[j]) && (visiting_team == visiting_teams[j]) ) game_valid = true;');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      if (game_valid == false) continue;');
   d.writeln('');
   d.writeln('      // Determine the status and state of the current game.');
   d.writeln('');
   d.writeln('      if ( ((game.qtr + "") == "null") || (game.qtr == "Pregame") )');
   d.writeln('      {');
   d.writeln('         game_status = "game_not_started";');
   d.writeln('         game_state  = "";');
   d.writeln('      }');
   d.writeln('      else if (game.qtr == "Halftime")');
   d.writeln('      {');
   d.writeln('         game_status = "halftime";');
   d.writeln('         game_state  = "H";');
   d.writeln('      }');
   d.writeln('      else if (game.qtr == "Final")');
   d.writeln('      {');
   d.writeln('         game_status = "game_over";');
   d.writeln('         game_state  = "F";');
   d.writeln('      }');
   d.writeln('      else if (game.qtr == "final overtime")');
   d.writeln('      {');
   d.writeln('         game_status = "game_over";');
   d.writeln('         game_state  = "F OT";');
   d.writeln('      }');
   d.writeln('      else');
   d.writeln('      {');
   d.writeln('         game_status = "game_in_progress";');
   d.writeln('');
   d.writeln('         // Set the game state to the game quarter, halftime, or overtime.');
   d.writeln('');
   d.writeln('         if (game.qtr == 1) game_state = "1st";');
   d.writeln('         if (game.qtr == 2) game_state = "2nd";');
   d.writeln('         if (game.qtr == 3) game_state = "3rd";');
   d.writeln('         if (game.qtr == 4) game_state = "4th";');
   d.writeln('         if (game.qtr >= 5) game_state = "OT" + (game.qtr-4);');
   d.writeln('');
   d.writeln('         // Set the game clock string.');
   d.writeln('');
   d.writeln('         game_clock_string = game.clock;');
   d.writeln('');
   d.writeln('         // Determine if there are two minutes or less to play in the 2nd quarter, 4th quarter, or overtime.');
   d.writeln('');
   d.writeln('         if ( (game_state.substring(0,1) == "2") || (game_state.substring(0,1) == "4") )');
   d.writeln('         {');
   d.writeln('            if (game_clock_string != "")');
   d.writeln('            {');
   d.writeln('               game_clock_integer = game_clock_string;');
   d.writeln('               game_clock_integer = game_clock_integer.replace(/:/g,"");  // Remove the ":".');
   d.writeln('               game_clock_integer = game_clock_integer - 0;               // Make sure game_clock is an integer.');
   d.writeln('');
   d.writeln('               if (game_clock_integer <= 200)');
   d.writeln('               {');
   d.writeln('                  // Set the color of the game clock string to red to indicate two minutes or less to go.');
   d.writeln('');
   d.writeln('                  game_clock_string = "<font color=red>" + game_clock_string + "</font>";');
   d.writeln('               }');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('');
   d.writeln('         // Remove leading zero in the game_clock_string.');
   d.writeln('');
   d.writeln('         if (game_clock_string.charAt(game_clock_string.indexOf(":")-2) == "0")');
   d.writeln('         {');
   d.writeln('            temp_string  = game_clock_string.substring(0,game_clock_string.indexOf(":")-2);');
   d.writeln('            temp_string += game_clock_string.substring(game_clock_string.indexOf(":")-1);');
   d.writeln('');
   d.writeln('            game_clock_string = temp_string;');
   d.writeln('         }');
   d.writeln('');
   d.writeln('         // Add the game clock to the game state.');
   d.writeln('');
   d.writeln('         game_state = game_state + " " + game_clock_string;');
   d.writeln('');
   d.writeln('         // Add the down, yards to go, and yard line to the game state.');
   d.writeln('');
   d.writeln('         if (game.down == 1) down = "1st";');
   d.writeln('         if (game.down == 2) down = "2nd";');
   d.writeln('         if (game.down == 3) down = "3rd";');
   d.writeln('         if (game.down == 4) down = "4th";');
   d.writeln('');
   d.writeln('         game_state = game_state + "<br><font size=-2>" + down + " & " + game.togo.toString() + " at " + game.yl + "</font>";');
   d.writeln('');
   d.writeln('         // Determine the actual name of the team that has possession of the ball from its abbreviated city name and save it.');
   d.writeln('')
   d.writeln('         for (var k = 0; k < nfl_team_city_abbreviations.length; k++)');
   d.writeln('         {');
   d.writeln('            if (game.posteam == nfl_team_city_abbreviations[k])');
   d.writeln('            {');
   d.writeln('               window.top.gv.post_season_possession_teams[possession_teams_index] = nfl_team_names[k];');
   d.writeln('');
   d.writeln('               if ((game.redzone + "") == "true" )');
   d.writeln('               {');
   d.writeln('                  window.top.gv.post_season_red_zone_flags[possession_teams_index] = true;');
   d.writeln('               }');
   d.writeln('')
   d.writeln('               possession_teams_index++;');
   d.writeln('');
   d.writeln('               break;');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      //JL alert(":"+visiting_team+":"+visiting_score+":"+home_team+":"+home_score+":"+game_status+":"+game_state);');
   d.writeln('');
   d.writeln('      // Determine if this game is in progress and if so remember the scores and the game state.');
   d.writeln('');
   d.writeln('      for (var j = scores_index_start; j <= scores_index_stop; j++)');
   d.writeln('      {');
   d.writeln('         if ( (visiting_teams[j] == visiting_team) && (home_teams[j] == home_team) )');
   d.writeln('         {');
   d.writeln('            // Reset the scores of this game to zero.');
   d.writeln('');
   d.writeln('            window.top.gv.visitor_scores[j] = 0;');
   d.writeln('            window.top.gv.home_scores[j]    = 0;');
   d.writeln('');
   d.writeln('            // If this game is in progress remember the scores.');
   d.writeln('');
   d.writeln('            if (game_status != "game_not_started")');
   d.writeln('            {');
   d.writeln('               games_in_progress = true;');
   d.writeln('');
   d.writeln('               window.top.gv.visitor_scores[j]          = visiting_score;');
   d.writeln('               window.top.gv.home_scores[j]             = home_score;');
   d.writeln('               window.top.gv.post_season_game_states[j] = "<font style=\\"font-size: 8pt\\">" + game_state + "</font>";');
   d.writeln('            }');
   d.writeln('');
   d.writeln('            // If this game is over remember the winner.');
   d.writeln('');
   d.writeln('            if (game_status == "game_over")');
   d.writeln('            {');
   d.writeln('               if (visiting_score > home_score)');
   d.writeln('               {');
   d.writeln('                  window.top.gv.post_season_victors[post_season_victors_index] = visiting_team;');
   d.writeln('');
   d.writeln('                  post_season_victors_index++;');
   d.writeln('               }');
   d.writeln('               else if (home_score > visiting_score)');
   d.writeln('               {');
   d.writeln('                  window.top.gv.post_season_victors[post_season_victors_index] = home_team;');
   d.writeln('');
   d.writeln('                  post_season_victors_index++;');
   d.writeln('               }');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (games_in_progress == false)');
   d.writeln('   {');
   d.writeln('      alert("There are no Post Season Week " + week + " games in progress yet.");');
   d.writeln('');
   d.writeln('      // Force auto refresh to be off if no games are in progress.');
   d.writeln('');
   d.writeln('      window.top.gv.get_scores_state = "off";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Redisplay the preliminary form.');
   d.writeln('');
   d.writeln('   document.location.href = "fp_post_season_form.html";');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('</'+'script>');
   d.writeln('');
   d.writeln('');
   d.writeln('<center>');
   d.writeln('');
   if ( (top.gv.mobile != true) || (navigator.platform == "iPad") )
   {
      d.writeln('<font style="font-family: Calibri; font-size: 16pt; font-weight: bold; padding: 10px">'+document_heading+'</font><p>');
      d.writeln('');
   }

   d.writeln('<form name="fp_scores">');
   d.writeln('');

   d.writeln('<table   align=center');
   d.writeln('         class="b3_border"');
   d.writeln('        border=0');
   d.writeln('       bgcolor=white');
   d.writeln('   cellpadding=2');
   d.writeln('   cellspacing=0');
   d.writeln('            id="post_season_table">');
   d.writeln('');

   d.writeln('<tr align=center bgcolor=#C4D79B height=21px>');
   d.writeln('<td nowrap class="br2_bb2_border" colspan=5>');
   d.writeln('<font style="font-size: 14pt"><b>Week '+week+' '+mode_string+'</b></font>');
   d.writeln('</td>');
   for (var pi = 1; pi <= number_of_ps_players; pi++)
   {
      if (pi == number_of_ps_players)
      {
         d.writeln('<td class="bb2_border" colspan='+player_colspan+'><font style="font-size: 12pt"><b>'+ps_players[player_index[pi-1]]+'</b></font></td>');
      }
      else
      {
         d.writeln('<td class="br2_bb2_border" colspan='+player_colspan+'><font style="font-size: 12pt"><b>'+ps_players[player_index[pi-1]]+'</b></font></td>');
      }
   }
   d.writeln('</tr>');

   for (var gi = 1; gi <= number_of_ps_games; gi++)
   {
      // Determine if this game falls within the current preliminary week.

      current_prelim_week = false;

      if ( ( (week == 1) && (gi >= w1_start && gi <= w1_end) ) ||
           ( (week == 2) && (gi >= w2_start && gi <= w2_end) ) ||
           ( (week == 3) && (gi >= w3_start && gi <= w3_end) ) ||
           ( (week == 4) && (gi >= w4_start && gi <= w4_end) )    )
      {
         if (mode == "prelim") current_prelim_week = true;
      }

      if ( (gi == w1_start) || (gi == w2_start) || (gi == w3_start) || (gi == w4_start) )
      {
         d.writeln('');
         d.writeln('<tr height=8px>');
         d.writeln('<td class="bb2_border" colspan='+(5+player_colspan*12)+'></td>');
         d.writeln('</tr>');
         d.writeln('');
         d.writeln('<tr align=center bgcolor=#DCE6F1 height=18px>');

         if (gi == w1_start)
         {
            d.writeln('<td nowrap class="br2_bb2_border" colspan=5><font style="font-size: 11pt"><b>Wild Card Weekend</b></font></td>');
         }
         else if (gi == w2_start)
         {
            d.writeln('<td nowrap class="br2_bb2_border" colspan=5><font style="font-size: 11pt"><b>Divisional Playoffs</b></font></td>');
         }
         else if (gi == w3_start)
         {
            d.writeln('<td nowrap class="br2_bb2_border" colspan=5><font style="font-size: 11pt"><b>Conference Championships</b></font></td>');
         }
         else if (gi == w4_start)
         {
            d.writeln('<td nowrap class="br2_bb2_border" colspan=5><font style="font-size: 11pt"><b>Super Bowl</b></font></td>');
         }

         for (var pi = 1; pi <= number_of_ps_players; pi++)
         {
            if (form_view == "expanded")
            {
               d.writeln('<td class="gr1_bb2_border" colspan=3><font style="font-size: 10.5pt"><b>Pick</b></font></td>');
            }
            if (pi == number_of_ps_players)
            {
               d.writeln('<td class="bb2_border"><font style="font-size: 10.5pt" color=blue><b>Score</b></font></td>');
            }
            else
            {
               d.writeln('<td class="br2_bb2_border"><font style="font-size: 10.5pt" color=blue><b>Score</b></font></td>');
            }
         }
         d.writeln('</tr>');
      }

      d.writeln('');
      d.writeln('<tr align=center height=15px>');

      border_style = "gr1_gb1_border";

      if (use_player_points == false) border_style = "gr1_bb1_border";

      if (current_prelim_week == true)
      {
         for (var j = 1; j <= number_of_ps_games; j++)
         {
            input_tag_style = "text-align:center; font-size: 10pt; font-family: Calibri; border: 1px solid lightgray";

            if ( (visiting_teams[gi-1] == victors[j-1]) || (home_teams[gi-1] == victors[j-1]) )
            {
               // Highlight the background of the scores to signify that the game has concluded.

               input_tag_style = "text-align:center; font-size: 10pt; font-family: Calibri; border: 1px solid lightgray; background-color: #DCE6F1";

               break;
            }
         }

         // Determine which team (if any) has possession of the ball and if they're in the red zone.

         bullet_color                  = color_black;
         home_team_possession_flag     = "";
         visiting_team_possession_flag = "";

         for (var j = 1; j <= number_of_ps_games; j++)
         {
            if (post_season_possession_teams[j-1] == visiting_teams[gi-1])
            {
               // Set the visiting team possession flag.

               if (post_season_red_zone_flags[j-1] == true) bullet_color = color_red;

               visiting_team_possession_flag = "<span style='font-weight:bold; color:"+bullet_color+"'>\u2022&nbsp;</span>";

               break;
            }
            else if (post_season_possession_teams[j-1] == home_teams[gi-1])
            {
               // Set the home team possession flag.

               if (post_season_red_zone_flags[j-1] == true) bullet_color = color_red;

               home_team_possession_flag = "<span style='font-weight:bold; color:"+bullet_color+"'>\u2022&nbsp;</span>";

               break;
            }
         }

         // Set the game state flag (quarter, halftime, or overtime) if the game is in progress.

         game_state = window.top.gv.post_season_game_states[gi-1];

         if ( (gi == w1_end) || (gi == w2_end) || (gi == w3_end) || (gi == w4_end) )
         {
            d.writeln('<td style="padding: 0px" class="'+border_style+'">');
         }
         else
         {
            d.writeln('<td style="padding: 0px" class="gr1_border">');
         }

         d.writeln('<input type=text style="'+input_tag_style+'" value='+visitor_scores[gi-1]+' size="'+input_field_size+'" maxlength="2" name="visitor'+gi+'_score">');
         d.writeln('</td>');
      }
      else
      {
         // Make sure possession flags are cleared for games not being played this week.

         home_team_possession_flag     = "";
         visiting_team_possession_flag = "";
         game_state                    = "at";

         if ( (gi == w1_end) || (gi == w2_end) || (gi == w3_end) || (gi == w4_end) )
         {
            d.writeln('<td style="padding:2px 4px 2px 4px" class="'+border_style+'"><font style="font-size: 10pt">'+visitor_scores[gi-1]+'</font></td>');
         }
         else
         {
            d.writeln('<td style="padding:2px 4px 2px 4px" class="gr1_border"><font style="font-size: 10pt" >'+visitor_scores[gi-1]+'</font></td>');
         }
      }

      border_style = "gb1_border"; if (current_prelim_week == true) border_style = "gr1_gb1_border";

      if (use_player_points == false) {border_style = "bb1_border"; if (current_prelim_week == true) border_style = "gr1_bb1_border";}

      if ( (gi != w1_end) && (gi != w2_end) && (gi != w3_end) && (gi != w4_end) )
      {
         border_style = "no_border"; if (current_prelim_week == true) border_style = "gr1_border";
      }

      if (post_season_winners[gi-1] == "V")
      {
         d.writeln('<td class="'+border_style+'"><font style="font-size: 10pt; color: blue">'+visiting_team_possession_flag+visiting_teams[gi-1]+'</font></td>');
      }
      else
      {
         d.writeln('<td class="'+border_style+'"><font style="font-size: 10pt">'+visiting_team_possession_flag+visiting_teams[gi-1]+'</font></td>');
      }

      d.writeln('<td nowrap class="'+border_style+'"><font style="font-size: 10pt">'+game_state+'</font></td>');

      border_style = "gr1_gb1_border";

      if (use_player_points == false) border_style = "gr1_bb1_border";

      if (post_season_winners[gi-1] == "H")
      {
         if ( (gi == w1_end) || (gi == w2_end) || (gi == w3_end) || (gi == w4_end) )
         {
            d.writeln('<td class="'+border_style+'"><font style="font-size: 10pt; color: blue">'+home_team_possession_flag+home_teams[gi-1]+'</font></td>');
         }
         else
         {
            d.writeln('<td class="gr1_border"><font style="font-size: 10pt; color: blue">'+home_team_possession_flag+home_teams[gi-1]+'</font></td>');
         }
      }
      else
      {
         if ( (gi == w1_end) || (gi == w2_end) || (gi == w3_end) || (gi == w4_end) )
         {
            d.writeln('<td class="'+border_style+'"><font style="font-size: 10pt">'+home_team_possession_flag+home_teams[gi-1]+'</font></td>');
         }
         else
         {
            d.writeln('<td class="gr1_border"><font style="font-size: 10pt">'+home_team_possession_flag+home_teams[gi-1]+'</font></td>');
         }
      }

      border_style = "br2_gb1_border";

      if (use_player_points == false) border_style = "br2_bb1_border";

      if (current_prelim_week == true)
      {
         if ( (gi == w1_end) || (gi == w2_end) || (gi == w3_end) || (gi == w4_end) )
         {
            d.writeln('<td style="padding: 0px" class="'+border_style+'">');
         }
         else
         {
            d.writeln('<td style="padding: 0px" class="br2_border">');
         }
         d.writeln('<input type=text style="'+input_tag_style+'" value='+home_scores[gi-1]+' size="'+input_field_size+'" maxlength="2" name="home'+gi+'_score">');
         d.writeln('</td>');
      }
      else
      {
         if ( (gi == w1_end) || (gi == w2_end) || (gi == w3_end) || (gi == w4_end) )
         {
            d.writeln('<td style="padding:2px 4px 2px 4px" class="'+border_style+'"><font style="font-size: 10pt">'+home_scores[gi-1]+'</font></td>');
         }
         else
         {
            d.writeln('<td style="padding:2px 4px 2px 4px" class="br2_border"><font style="font-size: 10pt">'+home_scores[gi-1]+'</font></td>');
         }
      }

      for (var pi = 1; pi <= number_of_ps_players; pi++)
      {
         var score_color = "class=blue_color";

         if (player_picks[player_index[pi-1]][gi-1] != post_season_winners[gi-1])
         {
            score_color = "class=black_color";
         }
         if (form_view == "expanded")
         {
            if ( (gi == w1_end) || (gi == w2_end) || (gi == w3_end) || (gi == w4_end) )             
            {
               border_style = "gb1_border";

               if (use_player_points == false) border_style = "bb1_border";

               d.writeln('<td class="'+border_style+'"><font style="font-size: 10pt">'+player_picks[player_index[pi-1]][gi-1]+'</font></td>');
               d.writeln('<td class="'+border_style+'"><font style="font-size: 10pt">by</font></td>');

               border_style = "gr1_gb1_border";

               if (use_player_points == false) border_style = "gr1_bb1_border";

               d.writeln('<td class="'+border_style+'"><font style="font-size: 10pt">'+player_spreads[player_index[pi-1]][gi-1]+'</font></td>');
            }
            else
            {
               d.writeln('<td><font style="font-size: 10pt">'+player_picks[player_index[pi-1]][gi-1]+'</font></td>');
               d.writeln('<td><font style="font-size: 10pt">by</font></td>');  
               d.writeln('<td class="gr1_border"><font style="font-size: 10pt">'+player_spreads[player_index[pi-1]][gi-1]+'</font></td>');
            } 
         }

         if (pi == number_of_ps_players)
         {
            if ( (gi == w1_end) || (gi == w2_end) || (gi == w3_end) || (gi == w4_end) )
            {
               border_style = "gb1_border";

               if (use_player_points == false) border_style = "bb1_border";

               d.writeln('<td class="'+border_style+'"><font style="font-size: 10pt" '+score_color+'>'+player_scores[player_index[pi-1]][gi-1]+'</font></td>');
            }
            else
            {
               d.writeln('<td><font style="font-size: 10pt" '+score_color+'>'+player_scores[player_index[pi-1]][gi-1]+'</font></td>');
            }
         }
         else
         {
            if ( (gi == w1_end) || (gi == w2_end) || (gi == w3_end) || (gi == w4_end) )
            {
               border_style = "br2_gb1_border";

               if (use_player_points == false) border_style = "br2_bb1_border";

               d.writeln('<td class="'+border_style+'"><font style="font-size: 10pt" '+score_color+'>'+player_scores[player_index[pi-1]][gi-1]+'</font></td>');
            }
            else
            {
               d.writeln('<td class="br2_border"><font style="font-size: 10pt" '+score_color+'>'+player_scores[player_index[pi-1]][gi-1]+'</font></td>');
            }
         }
      }

      d.writeln('</tr>');  

      if ( (gi == w1_end) || (gi == w2_end) || (gi == w3_end) || (gi == w4_end) )
      {
         if (use_player_points == true)
         {
            if (gi == w1_end)
            {
               high_score_count   = week_1_high_score_count;
               high_score_players = week_1_high_score_players;
            }
            if (gi == w2_end)
            {
               high_score_count   = week_2_high_score_count;
               high_score_players = week_2_high_score_players;
            }
            if (gi == w3_end)
            {
               high_score_count   = week_3_high_score_count;
               high_score_players = week_3_high_score_players;
            }
            if (gi == w4_end)
            {
               high_score_count   = week_4_high_score_count;
               high_score_players = week_4_high_score_players;
            }

            total_points = visitor_scores[gi-1] + home_scores[gi-1];

            if (isNaN(total_points) == true) total_points = "<br>";

            d.writeln('');
            d.writeln('<tr align=center height=12px>');

            d.writeln('<td align=right class="bb1_border" colspan=4 style="padding:0px"><font style="font-size: 8pt">Actual Total Points:&nbsp;</font></td>');
            d.writeln('<td class="br2_bb1_border" style="padding:0px"><font style="font-size: 8pt">'+total_points+'</font></td>');

            for (var pi = 1; pi <= number_of_ps_players; pi++)
            {
               if (form_view == "expanded")
               {
                  points = player_points[player_index[pi-1]][gi-1];

                  if (points == 0) points = "<br>";

                  d.writeln('<td class="bb1_border"     colspan=2 style="padding:0px"><font style="font-size: 8pt">Points:</font></td>');
                  d.writeln('<td class="gr1_bb1_border" colspan=1 style="padding:0px"><font style="font-size: 8pt">'+points+'</font></td>');
               }

               total_points_score = "<br>";

               if ( (high_score_count > 1) && (total_points > 0) )
               {
                  for (var index = 1; index <= high_score_count; index++)
                  {
                     if (high_score_players[index-1] == player_index[pi-1])
                     {
                        if (isNaN(player_points[player_index[pi-1]][gi-1]) == false)
                        {
                           total_points_score = total_points - player_points[player_index[pi-1]][gi-1];
                        }
                     }
                  }
               }

               if (pi == number_of_ps_players)
               {
                  d.writeln('<td class="bb1_border" colspan=1 style="padding:0px"><font style="font-size: 8pt" color=blue>'+total_points_score+'</font></td>');
               }
               else
               {
                  d.writeln('<td class="br2_bb1_border" colspan=1 style="padding:0px"><font style="font-size: 8pt" color=blue>'+total_points_score+'</font></td>');
               }
            }

            d.writeln('</tr>');
         }

         d.writeln('');
         d.writeln('<tr align=center height=18px>');

         if (gi == w1_end)
         {
            d.writeln('<td nowrap class="br2_bb2_border" align=right colspan=5><font style="font-size: 11pt"><b>Week 1 Scores:&nbsp;</b></font></td>');
         }
         if (gi == w2_end)
         {
            d.writeln('<td nowrap class="br2_bb2_border" align=right colspan=5><font style="font-size: 11pt"><b>Week 2 Scores:&nbsp;</b></font></td>');
         }
         if (gi == w3_end)
         {
            d.writeln('<td nowrap class="br2_bb2_border" align=right colspan=5><font style="font-size: 11pt"><b>Week 3 Scores:&nbsp;</b></font></td>');
         }
         if (gi == w4_end)
         {
            d.writeln('<td nowrap class="br2_bb2_border" align=right colspan=5><font style="font-size: 11pt"><b>Week 4 Scores:&nbsp;</b></font></td>');
         }

         for (var pi = 1; pi <= number_of_ps_players; pi++)
         {
            if (week_1_scores[player_index[pi-1]] == null_score)
            {
               week_1_ranks[player_index[pi-1]]  = "<br>";
               week_1_scores[player_index[pi-1]] = "<br>";
            }

            if (week_2_scores[player_index[pi-1]] == null_score)
            {
               week_2_ranks[player_index[pi-1]]  = "<br>";
               week_2_scores[player_index[pi-1]] = "<br>";
            }

            if (week_3_scores[player_index[pi-1]] == null_score)
            {
               week_3_ranks[player_index[pi-1]]  = "<br>";
               week_3_scores[player_index[pi-1]] = "<br>";
            }

            if (week_4_scores[player_index[pi-1]] == null_score)
            {
               week_4_ranks[player_index[pi-1]]  = "<br>";
               week_4_scores[player_index[pi-1]] = "<br>";
            }

            td_background = "";

            if ( (gi == w1_end) && (week_1_valid_game_cnt > 0) )
            {
               if (week_1_ranks[player_index[pi-1]] == 1) td_background = "bgcolor=#DCE6F1";
            }
            if ( (gi == w2_end) && (week_2_valid_game_cnt > 0) )
            {
               if (week_2_ranks[player_index[pi-1]] == 1) td_background = "bgcolor=#DCE6F1";
            }
            if ( (gi == w3_end) && (week_3_valid_game_cnt > 0) )
            {
               if (week_3_ranks[player_index[pi-1]] == 1) td_background = "bgcolor=#DCE6F1";
            }
            if ( (gi == w4_end) && (week_4_valid_game_cnt > 0) )
            {
               if (week_4_ranks[player_index[pi-1]] == 1) td_background = "bgcolor=#DCE6F1";
            }

            if (form_view == "expanded")
            {
               d.writeln('<td nowrap '+td_background+' class="gr1_bb2_border" colspan=3><font style="font-size: 9pt" color=blue>Rank = ');
               if (gi == w1_end)
               {
                  if (week_1_valid_game_cnt > 0)
                  {
                     d.writeln(week_1_ranks[player_index[pi-1]]);
                  }
                  else
                  {
                     d.writeln('<br>');
                  }
               }
               else if (gi == w2_end)
               {
                  if (week_2_valid_game_cnt > 0)
                  {
                     d.writeln(week_2_ranks[player_index[pi-1]]);
                  }
                  else
                  {
                     d.writeln('<br>');
                  }
               }
               else if (gi == w3_end)
               {
                  if (week_3_valid_game_cnt > 0)
                  {
                     d.writeln(week_3_ranks[player_index[pi-1]]);
                  }
                  else
                  {
                     d.writeln('<br>');
                  }
               }
               else if (gi == w4_end)
               {
                  if (week_4_valid_game_cnt > 0)
                  {
                     d.writeln(week_4_ranks[player_index[pi-1]]);
                  }
                  else
                  {
                     d.writeln('<br>');
                  }
               }
               d.writeln('</font></td>');
            }
            if (pi == number_of_ps_players)
            {
               d.writeln('<td '+td_background+' class="bb2_border"><font style="font-size: 11pt" color=blue><b>');
            }
            else
            {
               d.writeln('<td '+td_background+' class="br2_bb2_border"><font style="font-size:11pt" color=blue><b>');
            }
            if (gi == w1_end)
            {
               if (week_1_valid_game_cnt > 0)
               {
                  score = week_1_scores[player_index[pi-1]];
                  if (isNaN(score) == false) score = week_1_scores[player_index[pi-1]].toFixed(decimal_count);
                  d.writeln(score);
               }
               else
               {
                  d.writeln('<br>');
               }
            }
            else if (gi == w2_end)
            {
               if (week_2_valid_game_cnt > 0)
               {
                  score = week_2_scores[player_index[pi-1]];
                  if (isNaN(score) == false) score = week_2_scores[player_index[pi-1]].toFixed(decimal_count);
                  d.writeln(score);
               }
               else
               {
                  d.writeln('<br>');
               }
            }
            else if (gi == w3_end)
            {
               if (week_3_valid_game_cnt > 0)
               {
                  score = week_3_scores[player_index[pi-1]];
                  if (isNaN(score) == false) score = week_3_scores[player_index[pi-1]].toFixed(decimal_count);
                  d.writeln(score);
               }
               else
               {
                  d.writeln('<br>');
               }
            }
            else if (gi == w4_end)
            {
               if (week_4_valid_game_cnt > 0)
               {
                  score = week_4_scores[player_index[pi-1]];
                  if (isNaN(score) == false) score = week_4_scores[player_index[pi-1]].toFixed(decimal_count);
                  d.writeln(score);
               }
               else
               {
                  d.writeln('<br>');
               }
            }
            d.writeln('</b></font></td>');
         }
         d.writeln('</tr>');
      }
   }

   d.writeln('');
   d.writeln('<tr height=8px>');
   d.writeln('<td class="bb2_border" colspan='+(5+player_colspan*12)+'></td>');
   d.writeln('</tr>');
   d.writeln('');
   d.writeln('<tr align=center bgcolor=#DCE6F1 height=18px>');
   d.writeln('<td nowrap class="br2_bb2_border" colspan=5><font style="font-size: 11pt"><b>Cumulative Results</b></font></td>');
   for (var pi = 1; pi <= number_of_ps_players; pi++)
   {
      if (form_view == "expanded")
      {
         d.writeln('<td class="gr1_bb2_border" colspan=3><font style="font-size: 10.5pt"><b>Rank</b></font></td>');
      }
      if (pi == number_of_ps_players)
      {
         d.writeln('<td class="bb2_border"><font style="font-size: 10.5pt" color=blue><b>Score</b></font></td>');
      }
      else
      {
         d.writeln('<td class="br2_bb2_border"><font style="font-size: 10.5pt" color=blue><b>Score</b></font></td>');
      }
   }
   d.writeln('</tr>');

   d.writeln('');
   d.writeln('<tr align=center height=21px>');
   d.writeln('<td nowrap class="br2_bb1_border" align=right colspan=5><font style="font-size: 11pt"><b>Scores:&nbsp;</b></font></td>');
   for (var pi = 1; pi <= number_of_ps_players; pi++)
   {
      if (overall_scores[player_index[pi-1]] == null_score)
      {
         overall_ranks[player_index[pi-1]]  = "<br>";
         overall_scores[player_index[pi-1]] = "<br>";
      }

      td_background = "";

      if (overall_ranks[player_index[pi-1]] == 1) td_background = "bgcolor=#DCE6F1";

      if (form_view == "expanded")
      {
         d.writeln('<td nowrap '+td_background+' class="gr1_bb1_border" colspan=3><font style="font-size: 9pt" color=blue>Rank = '+overall_ranks[player_index[pi-1]]+'</font></td>');
      }
      if (pi == number_of_ps_players)
      {
         score = overall_scores[player_index[pi-1]];
         if (isNaN(score) == false) score = overall_scores[player_index[pi-1]].toFixed(decimal_count);
         d.writeln('<td '+td_background+' class="bb1_border"><font style="font-size: 11pt" color=blue><b>'+score+'</b></font></td>');
      }
      else
      {
         score = overall_scores[player_index[pi-1]];
         if (isNaN(score) == false) score = overall_scores[player_index[pi-1]].toFixed(decimal_count);
         d.writeln('<td '+td_background+' class="br2_bb1_border"><font style="font-size: 11pt" color=blue><b>'+score+'</b></font></td>');
      }
   }
   d.writeln('</tr>');

   d.writeln('');
   d.writeln('<tr align=center height=21px>');
   d.writeln('<td nowrap class="br2_border" align=right colspan=5><font style="font-size: 11pt"><b>Wins:&nbsp;</b></font></td>');
   for (var pi = 1; pi <= number_of_ps_players; pi++)
   {
      if ( (overall_scores[player_index[pi-1]] == null_score) || (overall_scores[player_index[pi-1]] == "<br>") )
      {
         percent_wins                         = "<br>";
         player_win_count[player_index[pi-1]] = "<br>";
      }
      else if (possible_win_count < 1)
      {
         percent_wins                         = "<br>";
         player_win_count[player_index[pi-1]] = 0;
      }
      else
      {
         percent_wins = Math.round((player_win_count[player_index[pi-1]]/possible_win_count)*100) + "%";
      }

      td_background = "";

      if (player_win_count[player_index[pi-1]] == best_player_win_count) td_background = "bgcolor=#DCE6F1";

      if (form_view == "expanded")
      {
         d.writeln('<td nowrap '+td_background+' class="gr1_border" colspan=3><font style="font-size: 9pt" color=blue>Wins = '+player_win_count[player_index[pi-1]]+'</font></td>');
      }
      else
      {
         percent_wins = player_win_count[player_index[pi-1]];
      }

      if (pi == number_of_ps_players)
      {
         d.writeln('<td '+td_background+'><font style="font-size: 9pt" color=blue>'+percent_wins+'</font></td>');
      }
      else
      {
         d.writeln('<td '+td_background+' class="br2_border"><font style="font-size: 9pt" color=blue>'+percent_wins+'</font></td>');
      }
   }
   d.writeln('</tr>');

   d.writeln('');
   d.writeln('</table>');

   d.writeln('');
   d.writeln('<table cols=1 align=center>');
   d.writeln('');

   d.writeln('<tr><td class="no_border" style="font-size: 2pt"><br></td></tr>');
   d.writeln('');
   if (mode == "prelim")
   {
      d.writeln('<tr align=center>');
      d.writeln('<td nowrap valign=middle class="no_border">');
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="get_scores_button" value="Get NFL Scores"');
      d.writeln('    onClick=get_nfl_scores(document,false,"");>');
      d.writeln('&nbsp;');
      d.writeln('<font face="Calibri" color=black style="font-size: 12pt">Auto Refresh:</font>&nbsp;');
      if (window.top.gv.get_scores_state == "off")
      {
         d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="get_scores_start_button" value="Start"');
         d.writeln('    onClick=get_scores_auto_refresh(document,"start");get_nfl_scores(document,false,"Start");>');
      }
      else
      {
         d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="get_scores_stop_button" value="Stop"');
         d.writeln('    onClick=get_scores_auto_refresh(document,"stop");document.location.href="fp_post_season_form.html";>');
      }
      d.writeln('</td>');
      d.writeln('</tr>');
      d.writeln('<tr><td class="no_border" style="font-size: 2pt"><br></td></tr>');
   }
   d.writeln('<tr align=center>');
   d.writeln('<td nowrap class="no_border">');
   if (mode == "prelim")
   {
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="calculate_scores_button" value="Calculate Player Scores"');
      d.writeln('    onClick="calculate_post_season_scores(document);return true;">');
      d.writeln('&nbsp;');
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="clear_scores_button" value="Clear Scores"');
      d.writeln('    onClick="clear_scores(document);return true;">');
      d.writeln('&nbsp;');
   }
   d.writeln('<select style="font-size: 11pt; font-family: Calibri; border: 1px solid black" name="order_by_menu" size=1');
   d.writeln('        onChange="change_order(document);return true;">');
   if (order_by == "players")
   {
      d.writeln('   <option selected value="players">Order By Player');
   }
   else
   {
      d.writeln('   <option value="players">Order By Player');

   }
   for (var wi = 1; wi <= week; wi++)
   {
      if (order_by == "week_"+wi+"_scores")
      {
         d.writeln('   <option selected value="week_'+wi+'_scores">Order By Week '+wi+' Score');
      }
      else
      {
         d.writeln('   <option value="week_'+wi+'_scores">Order By Week '+wi+' Score');
      }
   }
   if (order_by == "overall_scores")
   {
      d.writeln('   <option selected value="overall_scores">Order By Overall Score');   }
   else
   {
      d.writeln('   <option value="overall_scores">Order By Overall Score');
   }
   d.writeln('</select>');
   d.writeln('&nbsp;');
   if (form_view == "expanded")
   {
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="view_button" value="Hide Picks"');
   }
   else
   {
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="view_button" value="Show Picks"');
   }
   d.writeln('    onClick="change_view(document);return true;">');
   d.writeln('&nbsp;');
   d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="close_button" value="Close"');
   d.writeln('    onClick="javascript:window.top.close();">');
   d.writeln('</td>');
   d.writeln('</tr>');
   d.writeln('');

   d.writeln('</table>');
   d.writeln('');

   d.writeln('</form>');
   d.writeln('');

   d.writeln('</center>');
   d.writeln('');

   if (mode == "prelim")
   {
      if (window.top.gv.mobile != true)
      {
         number_of_w1_games = w1_end - w1_start + 1;
         number_of_w2_games = w2_end - w2_start + 1;
         number_of_w3_games = w3_end - w3_start + 1;
         number_of_w4_games = w4_end - w4_start + 1;

         if (week == 1) number_of_valid_games = number_of_w1_games;
         if (week == 2) number_of_valid_games = number_of_w1_games + number_of_w2_games;
         if (week == 3) number_of_valid_games = number_of_w1_games + number_of_w2_games + number_of_w3_games;
         if (week == 4) number_of_valid_games = number_of_w1_games + number_of_w2_games + number_of_w3_games + number_of_w4_games;

         for (var gi = 1; gi <= number_of_valid_games; gi++)
         {
            if ( (post_season_winners[gi-1] != "V") && (post_season_winners[gi-1] != "H") )
            {
               d.writeln('<script>document.fp_scores.visitor'+gi+'_score.focus();</'+'script>');
               break;
            }
            d.writeln('<script>document.fp_scores.view_button.focus();</'+'script>');
         }
      }

      if (window.top.gv.get_scores_timer != null)
      {
         clearInterval(window.top.gv.get_scores_timer);
      }

      if (window.top.gv.get_scores_state == "on")
      {
         window.top.gv.get_scores_timer = setInterval('get_nfl_scores(document,false,"");',10000);
      }
   }
   else
   {
      if (window.top.gv.mobile != true) d.writeln('<script>document.fp_scores.view_button.focus();</'+'script>');
   }
   d.writeln('');

   d.writeln('</body>');
   d.writeln('');

   d.writeln('</html>');

   adjust_mobile_viewport_height(d);

   if ( (top.gv.mobile == true) && (navigator.platform != "iPad") )
   {
      d.body.scrollLeft = 0;
      d.body.scrollTop  = 0;
   }
   else
   {
      d.getElementById("post_season_table").scrollIntoView();
   }

   d.close();

   return true;
}


function build_regular_season_form()
{
   if (check_for_opener() == false)
   {
      window.top.close();

      return false;
   }

   var best_mn_points_delta          = 1000;
   var best_outcome_tooltip          = "Look under &quot;Preliminary Scores&quot; on the &quot;Help&quot; page for more information on &quot;Best Outcome&quot;";
   var bullet_color                  = "";
   var color_black                   = "black";
   var color_red                     = "red";
   var document_heading              = "";
   var duplicates                    = 0;
   var form_view                     = window.top.gv.form_view;
   var game_state                    = "at";
   var input_tag_style               = "";
   var home_team_possession_flag     = "";
   var max_number_of_rs_games        = window.top.gv.max_number_of_rs_games;
   var mn_points_delta_string        = "";
   var mn_points_string              = " ";
   var mode                          = window.top.gv.mode;
   var mode_string                   = "";
   var order_by                      = window.top.gv.order_by;
   var player_colspan                = 3;
   var rs_players                    = window.top.gv.rs_players;
   var number_of_rs_players          = rs_players.length;
   var number_of_rs_weeks            = window.top.gv.all_home_teams.length;
   var tie_breaker_needed            = false;
   var unable_to_break_tie           = false;
   var unaltered_week                = 0;
   var victors                       = "";
   var visiting_team_possession_flag = "";
   var week                          = window.top.gv.current_input_week;
   var winners                       = "";

   if (max_number_of_rs_games == undefined) max_number_of_rs_games = 16;

   if ( (mode == "summary") || (mode == "summary_archive") )
   {
      build_season_summary();
      return true;
   }

   if (mode == "prelim")
   {
      mode_string             = "Preliminary";
      prelim_possession_teams = window.top.gv.prelim_possession_teams;
      prelim_red_zone_flags   = window.top.gv.prelim_red_zone_flags;
      victors                 = window.top.gv.prelim_victors;
      week                    = week - 1;
      winners                 = window.top.gv.prelim_winners;
   }
   else if (mode == "final")
   {
      mode_string = "Final";
      week        = week - 2;

      if (window.top.gv.games_over == true) week = week + 1;
   }
   else if (mode == "weekly_archive")
   {
      mode_string = "Final";
      week        = number_of_rs_weeks;

      window.top.gv.home_scores     = Array(max_number_of_rs_games).fill("");
      window.top.gv.visiting_scores = Array(max_number_of_rs_games).fill("");
   }

   if (week <  1)                 week =  1;
   if (week > number_of_rs_weeks) week = number_of_rs_weeks;

   // Over-ride "week" if user selected "week" from "Final On-Line Form" window.

   unaltered_week = week;

   if (window.top.gv.selected_week > 0) week = window.top.gv.selected_week;

   // Declare some more variables

   var home_scores           = window.top.gv.home_scores;
   var home_teams            = window.top.gv.all_home_teams[week-1];
   var visiting_scores       = window.top.gv.visiting_scores;
   var visiting_teams        = window.top.gv.all_visiting_teams[week-1];
   var open_date             = window.top.gv.all_open_dates[week-1];
   var picks                 = all_picks[week-1];
   var weights               = all_weights[week-1];
   var mn_points             = all_mn_points[week-1];
   var actual_mn_points      = all_actual_mn_points[week-1];
   var in_progress_mn_points = 0;

   if ( (mode == "final") || (mode == "weekly_archive") )
   {
      winners = all_winners[week-1];
   }

   var high_score         = 0;
   var high_score_count   = 0;
   var number_of_rs_games = home_teams.length;
   var max_scores         = Array(max_number_of_rs_games).fill().map((_,i) => (max_number_of_rs_games)*(max_number_of_rs_games+1)/2-(i-max_number_of_rs_games)*(i-max_number_of_rs_games+1)/2, max_number_of_rs_games);
   var max_score          = max_scores[number_of_rs_games-1];
   var mn_points_delta    = Array(number_of_rs_players).fill("N/A");
   var player_index       = Array(number_of_rs_players).fill().map((_,i) => i);  // Sets player_index = [0,1,2,3,4,5,6,7,8,9,10,11]
   var ranks              = Array(number_of_rs_players).fill(1);
   var ranks_adjust       = Array(number_of_rs_players).fill(0);
   var scores             = Array(number_of_rs_players).fill(max_score);
   var sorted_scores      = Array(number_of_rs_players).fill(1);

   // See above:  Assuming max_number_of_rs_games = 16, max_scores = [16,31,45,58,70,81,91,100,108,115,121,126,130,133,135,136]

   if (window.top.gv.mn_points_entered > 0)
   {
      // Override actual_mn_points with points entered on preliminary form

      actual_mn_points = window.top.gv.mn_points_entered;
   }

   in_progress_mn_points = parseInt(home_scores[number_of_rs_games-1].replace(/&nbsp;/g,"")) + parseInt(visiting_scores[number_of_rs_games-1].replace(/&nbsp;/g,""));

   if (isNaN(in_progress_mn_points) == true) in_progress_mn_points = 0;

   if (in_progress_mn_points > 0)
   {
      // Override actual_mn_points with actual Monday Night Total Points from get_nfl_scores

      actual_mn_points = in_progress_mn_points;
   }

   if (form_view == "expanded")
   {
      player_colspan = 3;
   }
   else
   {
      player_colspan = 1;
   }

   // Build document heading.

   if (mode == "prelim")
   {
      document_heading = "Regular Season - Week " + week + " Preliminary";
   }
   else if (mode == "final")
   {
      document_heading = "Regular Season - Week " + week + " Final";
   }
   else if (mode == "weekly_archive")
   {
      document_heading = window.top.gv.archive_year + " Regular Season Weekly Results";
   }

   // Calculate scores.

   for (var i = 1; i <= number_of_rs_games; i++)
   {
      // Determine if any game from get_nfl_scores has ended in a tie.

      for (var j = 1; j <= number_of_rs_games; j++)
      {
         if ( (visiting_teams[i-1] == victors[j-1]) || (home_teams[i-1] == victors[j-1]) )
         {
            if (visiting_scores[i-1] == home_scores[i-1]) winners[i-1] = "Tie";
         }
      }

      // Continue calculating scores.

      for (var ii = 1; ii <= number_of_rs_players; ii++)
      {
         if (picks[ii-1].length > 0)
         {
            if ( (winners[i-1] != "0") && (picks[ii-1][i-1] != winners[i-1]) )
            {
               scores[ii-1] = scores[ii-1] - weights[ii-1][i-1];
            }
         }
         else
         {
            scores[ii-1] = 0;
         }
      }
   }

   for (var i = 1; i <= number_of_rs_players; i++)
   {
      sorted_scores[i-1] = scores[i-1];
   }

   sorted_scores.sort(function(sorted_scores,b){return sorted_scores-b;});
   sorted_scores.reverse();

   // Determine if there's a tie.
 
   high_score       = sorted_scores[0];
   high_score_count = 0;

   for (var i = 1; i <= number_of_rs_players; i++)
   {
      if (scores[i-1] == high_score)
      {
         high_score_count++;

         mn_points_delta[i-1] = mn_points[i-1] - actual_mn_points;
      }
   }

   // If there's a tie, try to break the tie using the Monday Night Total Points predictions.

   if (high_score_count > 1)
   {
      tie_breaker_needed = true;

      // If the winner of at least one game is not known, then there's no need for a tie breaker.

      for (var i = 0; i < number_of_rs_games; i++)
      {
         if ((winners[i] != "H") && (winners[i] != "V") && (winners[i] != "Tie"))
         {
            tie_breaker_needed = false;
         }
      }

      // Attempt to break the tie.

      if (tie_breaker_needed == true)
      {
         // The tie can only be broken if the actual Monday Night Total Points are known.

         if (actual_mn_points > 0)
         {
            // Build the string for dislaying the actual Monday Night Total Points on the webpage.

            mn_points_string = " (Actual is " + actual_mn_points + ")";

            // Determine the best Monday Night Total Points delta.
            // (difference between best prediction and actual)

            best_mn_points_delta = 1000;

            for (var i = 1; i <= number_of_rs_players; i++)
            {
               if (mn_points_delta[i-1] != "N/A")
               {
                  if ( Math.abs(mn_points_delta[i-1]) < Math.abs(best_mn_points_delta) )
                  {
                     best_mn_points_delta = mn_points_delta[i-1];
                  }
                  else if ( Math.abs(mn_points_delta[i-1]) == Math.abs(best_mn_points_delta) )
                  {
                     if (mn_points_delta[i-1] < best_mn_points_delta)
                     {
                        best_mn_points_delta = mn_points_delta[i-1];
                     }
                  }
               }
            }

            // Determine if the players that are tied have the same Monday Night Total Points prediction.

            high_score_count = 0;

            for (var i = 1; i <= number_of_rs_players; i++)
            {
               if ( (mn_points_delta[i-1] != "N/A") && (mn_points_delta[i-1] == best_mn_points_delta) )
               {
                  high_score_count++;
               }
            }

            // If the players that are tied have the same Monday Night
            // Total Points prediction, then we can't break the tie.

            if (high_score_count > 1)
            {
               unable_to_break_tie = true;

               for (var i = 1; i <= number_of_rs_players; i++)
               {
                  // Clear out the Monday Night Total Points delta and adjust
                  // the rank of those players no longer involved in the tie.

                  if ((scores[i-1] == high_score) && (mn_points_delta[i-1] != best_mn_points_delta))
                  {
                     mn_points_delta[i-1] = "N/A";
                     ranks_adjust[i-1] = high_score_count; 
                  }
               }
            }
            else
            {
               // The tie can be broken, so adjust the ranks
               // of the playes who lost the tie breaker.

               for (var i = 1; i <= number_of_rs_players; i++)
               {
                  if ((mn_points_delta[i-1] != "N/A") && (mn_points_delta[i-1] != best_mn_points_delta))
                  {
                     ranks_adjust[i-1] = 1;
                  }
               }
            }
         }
      }
   }

   // Calculate ranks.

   for (var i = 1; i <= number_of_rs_players; i++)
   {
      for (var ii = 1; ii <= number_of_rs_players; ii++)
      {
         if (scores[i-1] == sorted_scores[ii-1])
         {
            ranks[i-1] = ii + ranks_adjust[i-1];
            break;
         }
      }
   }

   // Calculate player index for order by players or scores

   for (var i = 1; i <= number_of_rs_players; i++)
   {
      if (order_by == "players")
      {
         player_index[i-1] = i-1;
      }
      else
      {
         duplicates = 0;

         for (var ii = 1; ii <= number_of_rs_players; ii++)
         {
            if (i == ranks[ii-1])
            {
               player_index[(i+duplicates)-1] = ii-1;

               duplicates++;
            }
         }

         i = i + duplicates - 1;
      }
   }

   document.open();

   var d = document;

   d.writeln('<html>');
   d.writeln('');

   d.writeln('<head>');
   d.writeln('   <title>NFL Football Pool</title>');
   d.writeln('   <style type="text/css">');
   d.writeln('   <!--');
   d.writeln('      TD              {border-style:        solid;');
   d.writeln('                       border-color:    lightgray;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .b3_border      {border: 3px solid    black}');
   d.writeln('      .no_border      {border-style:        solid;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .bb1_border     {border-style:        solid;');
   d.writeln('                       border-color:        black;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .bb2_border     {border-style:        solid;');
   d.writeln('                       border-color:        black;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   2px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .br2_border     {border-style:        solid;');
   d.writeln('                       border-color:        black;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .br2_bb1_border {border-style:        solid;');
   d.writeln('                       border-color: white black black white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .br2_bb2_border {border-style:        solid;');
   d.writeln('                       border-color: white black black white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   2px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .br2_gb1_border {border-style:        solid;');
   d.writeln('                       border-color: white black lightgray white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .bt2_border     {border-style:        solid;');
   d.writeln('                       border-color:        black;');
   d.writeln('                       border-top-width:      2px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .bt2_br2_border {border-style:        solid;');
   d.writeln('                       border-color: black black white white;');
   d.writeln('                       border-top-width:      2px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .bt2_gr1_border {border-style:        solid;');
   d.writeln('                       border-color: black lightgray white white;');
   d.writeln('                       border-top-width:      2px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gb1_border     {border-style:        solid;');
   d.writeln('                       border-color:    lightgray;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gr1_border     {border-style:        solid;');
   d.writeln('                       border-color:    lightgray;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gr1_bb1_border {border-style:        solid;');
   d.writeln('                       border-color: white lightgray black white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gr1_bb2_border {border-style:        solid;');
   d.writeln('                       border-color: white lightgray black white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   2px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('   -->');
   d.writeln('   </style>');
   d.writeln('</head>');
   d.writeln('');

   d.writeln('<body>');
   d.writeln('');
   d.writeln('');

   d.writeln('<script language="JavaScript">');
   d.writeln('');
   d.writeln('function build_player_name(player_menu_index,long_description)');
   d.writeln('{');
   d.writeln('   if ( (player_menu_index < 0) || (player_menu_index > window.top.gv.rs_players.length) )');
   d.writeln('   {');
   d.writeln('      player_menu_index = window.top.gv.player_index;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (player_menu_index > 0)');
   d.writeln('   {');
   d.writeln('      if (long_description == true)');
   d.writeln('      {');
   d.writeln('         return window.top.gv.rs_players_description[player_menu_index-1]+" ("+window.top.gv.rs_players[player_menu_index-1]+")";');
   d.writeln('      }');
   d.writeln('      else');
   d.writeln('      {');
   d.writeln('         return window.top.gv.rs_players[player_menu_index-1];');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('   else');
   d.writeln('   {');
   d.writeln('      return "";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   return "";  // Should never get here.');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function calculate_prelim_scores(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   clear_get_scores_data();');
   d.writeln('');
   d.writeln('   get_selected_winners(document);');
   d.writeln('');
   d.writeln('   document.location.href = "fp_regular_season_form.html";');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function change_order(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (window.top.gv.order_by == "players")');
   d.writeln('   {');
   d.writeln('      window.top.gv.order_by = "scores";');
   d.writeln('   }');
   d.writeln('   else if (window.top.gv.order_by == "scores")');
   d.writeln('   {');
   d.writeln('      window.top.gv.order_by = "players";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (window.top.gv.mode == "weekly_archive")');
   d.writeln('   {');
   d.writeln('      document.location.href = "fp_forms_"+window.top.gv.archive_year+".html";');
   d.writeln('   }');
   d.writeln('   else');
   d.writeln('   {');
   d.writeln('      var refresh_scores = window.top.gv.refresh_scores;'); // Need to save refresh_scores because "clear_get_scores_data" will reset it.
   d.writeln('');
   d.writeln('      clear_get_scores_data();');
   d.writeln('');
   d.writeln('      if (window.top.gv.get_scores_state == "on" && refresh_scores == true)');
   d.writeln('      {');
   d.writeln('         get_nfl_scores(document,false,"");');
   d.writeln('      }');
   d.writeln('      else');
   d.writeln('      {');
   d.writeln('         document.location.href = "fp_regular_season_form.html";');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function change_view(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (window.top.gv.form_view == "expanded")');
   d.writeln('   {');
   d.writeln('      window.top.gv.form_view = "compact";');
   d.writeln('   }');
   d.writeln('   else if (window.top.gv.form_view == "compact")');
   d.writeln('   {');
   d.writeln('      window.top.gv.form_view = "expanded";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (window.top.gv.mode == "weekly_archive")');
   d.writeln('   {');
   d.writeln('      document.location.href = "fp_forms_"+window.top.gv.archive_year+".html";');
   d.writeln('   }');
   d.writeln('   else');
   d.writeln('   {');
   d.writeln('      var refresh_scores = window.top.gv.refresh_scores;'); // Need to save refresh_scores because "clear_get_scores_data" will reset it.
   d.writeln('');
   d.writeln('      clear_get_scores_data();');
   d.writeln('');
   d.writeln('      if (window.top.gv.get_scores_state == "on" && refresh_scores == true)');
   d.writeln('      {');
   d.writeln('         get_nfl_scores(document,false,"");');
   d.writeln('      }');
   d.writeln('      else');
   d.writeln('      {');
   d.writeln('         document.location.href = "fp_regular_season_form.html";');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function change_week(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   var results             = document.fp_results;');
   d.writeln('   var selected_week_index = 0;');
   d.writeln('   var selected_week       = 0;');
   d.writeln('');
   d.writeln('');
   d.writeln('   for (var i = 0; i < results.elements.length; i++)');
   d.writeln('   {');
   d.writeln('      if (results.elements[i].name == "selected_week_menu")');
   d.writeln('      {');
   d.writeln('         selected_week               = results.elements[i];');
   d.writeln('         selected_week_index         = selected_week.selectedIndex;');
   d.writeln('         window.top.gv.selected_week = selected_week.options[selected_week_index].value;');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (window.top.gv.mode == "weekly_archive")');
   d.writeln('   {');
   d.writeln('      document.location.href = "fp_forms_"+window.top.gv.archive_year+".html";');
   d.writeln('   }');
   d.writeln('   else');
   d.writeln('   {');
   d.writeln('      document.location.href = "fp_regular_season_form.html";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function clear_get_scores_data()');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Clear information set by "Get NFL Scores".');
   d.writeln('');
   d.writeln('   for (var i = 0; i < '+number_of_rs_games+'; i++)');
   d.writeln('   {');
   d.writeln('      window.top.gv.home_scores[i]             = "";');
   d.writeln('      window.top.gv.prelim_game_states[i]      = "at";');
   d.writeln('      window.top.gv.prelim_possession_teams[i] = "";');
   d.writeln('      window.top.gv.prelim_red_zone_flags[i]   = false;');
   d.writeln('      window.top.gv.prelim_victors[i]          = "";');
   d.writeln('      window.top.gv.visiting_scores[i]         = "";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   window.top.gv.refresh_scores = false;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function clear_winners(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   clear_get_scores_data();');
   d.writeln('');
   d.writeln('   for (var i = 0; i < '+number_of_rs_games+'; i++)');
   d.writeln('   {');
   d.writeln('      window.top.gv.prelim_winners[i] = "0";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   document.location.href = "fp_regular_season_form.html";');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function determine_best_outcome(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      // Make sure cursor is not set to "wait".');
   d.writeln('');
   d.writeln('      document.body.style.cursor = "auto";');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   var abort                   = false;');
   d.writeln('   var all_winners_specified   = true;');
   d.writeln('   var binary_winners          = "";');
   d.writeln('   var games_won               = 0;');
   d.writeln('   var max_opponent_score      = 0;');
   d.writeln('   var max_score_difference    = -1000;');
   d.writeln('   var most_games_won          = 0;');
   d.writeln('   var name_index              = 0;');
   d.writeln('   var name_menu               = 0;');
   d.writeln('   var number_of_rs_games      = 0;');
   d.writeln('   var number_of_rs_players    = window.top.gv.rs_players.length;');
   d.writeln('   var number_of_rs_weeks      = window.top.gv.all_home_teams.length;');
   d.writeln('   var opponent_score          = 0;');
   d.writeln('   var picks                   = "";');
   d.writeln('   var score_difference        = 0;');
   d.writeln('   var selected_opponent_index = window.top.gv.opponent_index-1;');
   d.writeln('   var selected_player_index   = window.top.gv.player_index-1;');
   d.writeln('   var selected_player_score   = 0;');
   d.writeln('   var selected_player_win     = false;');
   d.writeln('   var skip_iteration          = false;');
   d.writeln('   var specified_winner_count  = 0;');
   d.writeln('   var temp_name               = "";');
   d.writeln('   var week                    = window.top.gv.current_input_week - 1;');
   d.writeln('   var weights                 = "";');
   d.writeln('');
   d.writeln('');
   d.writeln('   // Adjust week, in case it is invalid for some reason.');
   d.writeln('');
   d.writeln('   if (week <  1)                 week = 1;');
   d.writeln('   if (week > number_of_rs_weeks) week = number_of_rs_weeks;');
   d.writeln('');
   d.writeln('   // Assign number_of_rs_games, picks, and weights based on week.  Create arrays based on number_of_rs_games.');
   d.writeln('');
   d.writeln('   number_of_rs_games = window.top.gv.all_home_teams[week-1].length;');
   d.writeln('   picks              = all_picks[week-1];');
   d.writeln('   weights            = all_weights[week-1];');
   d.writeln('');
   d.writeln('   var best_winners            = Array(number_of_rs_games).fill("");');
   d.writeln('   var selected_player_picks   = Array(number_of_rs_games).fill("");');
   d.writeln('   var selected_player_weights = Array(number_of_rs_games).fill("");');
   d.writeln('   var selected_winners        = Array(number_of_rs_games).fill("");');
   d.writeln('   var winners_iteration       = Array(number_of_rs_games).fill("");');
   d.writeln('');
   d.writeln('   // Get selected winners from preliminary form.');
   d.writeln('');
   d.writeln('   all_winners_specified = true;');
   d.writeln('');
   d.writeln('   get_selected_winners(document);');
   d.writeln('');
   d.writeln('   for (var game_index = 0; game_index < number_of_rs_games; game_index++)');
   d.writeln('   {');
   d.writeln('      selected_winners[game_index] = window.top.gv.prelim_winners[game_index];');
   d.writeln('');
   d.writeln('      if ( (selected_winners[game_index] == "H") || (selected_winners[game_index] == "V") || (selected_winners[game_index] == "Tie") )');
   d.writeln('      {');
   d.writeln('         if (selected_winners[game_index] != "Tie") specified_winner_count++;');
   d.writeln('      }');
   d.writeln('      else');
   d.writeln('      {');
   d.writeln('         all_winners_specified = false;');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Validate selections before proceeding.');
   d.writeln('');
   d.writeln('   if (all_winners_specified == true)');
   d.writeln('   {');
   d.writeln('      alert("\\"Best Outcome\\" cannot be performed if winners have already been specified for every game.");');
   d.writeln('');
   d.writeln('      if (window.top.gv.mobile != true) document.fp_results.calculate_scores_button.focus();');
   d.writeln('');
   d.writeln('      abort = true;');
   d.writeln('   }');
   d.writeln('   else if (selected_player_index < 0)');
   d.writeln('   {');
   d.writeln('      alert("Select a player for \\"Best Outcome\\".");');
   d.writeln('');
   d.writeln('      if (window.top.gv.mobile != true) document.fp_results.player_name_menu.focus();');
   d.writeln('');
   d.writeln('      abort = true;');
   d.writeln('   }');
   d.writeln('   else if (selected_player_index == selected_opponent_index)');
   d.writeln('   {');
   d.writeln('      alert("Player and opponent for \\"Best Outcome\\" cannot be the same.");');
   d.writeln('');
   d.writeln('      if (window.top.gv.mobile != true) document.fp_results.opponent_name_menu.focus();');
   d.writeln('');
   d.writeln('      abort = true;');
   d.writeln('   }');
   d.writeln('   else if (picks[selected_player_index].length == 0)');
   d.writeln('   {');
   d.writeln('      alert("The player selected for \\"Best Outcome\\" did not submit picks this week.");');
   d.writeln('');
   d.writeln('      if (window.top.gv.mobile != true) document.fp_results.player_name_menu.focus();');
   d.writeln('');
   d.writeln('      abort = true;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (abort == true)');
   d.writeln('   {');
   d.writeln('      // Make sure cursor is not set to "wait".');
   d.writeln('');
   d.writeln('      document.body.style.cursor = "auto";');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   clear_get_scores_data();');
   d.writeln('');
   d.writeln('   // Assign selected_player_picks and selected_player_weights.');
   d.writeln('');
   d.writeln('   for (var game_index = 0; game_index < number_of_rs_games; game_index++)');
   d.writeln('   {');
   d.writeln('      selected_player_picks[game_index]   = picks[selected_player_index][game_index];');
   d.writeln('      selected_player_weights[game_index] = weights[selected_player_index][game_index];');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Loop through for every possible win/loss combination for those games that do not already have a winner specified.');
   d.writeln('   // Games can end in a "Tie", but were are not going to take a "Tie" into account, unless the user specified a "Tie".');
   d.writeln('');
   d.writeln('   for (var i = 0; i < Math.pow(2,number_of_rs_games); i++)');
   d.writeln('   {');
   d.writeln('      // Convert i into a binary string.');
   d.writeln('');
   d.writeln('      binary_winners = i.toString(2);'); 
   d.writeln('');
   d.writeln('      // Add leading zeros as needed to get the length to equal sixteen.');
   d.writeln('');
   d.writeln('      for (var j = (number_of_rs_games-binary_winners.length); j > 0; j--)');
   d.writeln('      {');
   d.writeln('         binary_winners = "0" + binary_winners;');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      // Assign the winners for this iteration based on the binary_winners string.');
   d.writeln('');
   d.writeln('      for (var game_index = 0; game_index < number_of_rs_games; game_index++)');
   d.writeln('      {');
   d.writeln('         if (binary_winners.slice(game_index,game_index+1) == 0)');
   d.writeln('         {');
   d.writeln('            winners_iteration[game_index] = "H";');
   d.writeln('         }');
   d.writeln('         else');
   d.writeln('         {');
   d.writeln('            winners_iteration[game_index] = "V";');
   d.writeln('         }');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      // Set a flag to skip this iteration if a game outcome in this iteration disagrees with a game outcome specified by the user.');
   d.writeln('');
   d.writeln('      skip_iteration = false;');
   d.writeln('');
   d.writeln('      for (var game_index = 0; game_index < number_of_rs_games; game_index++)');
   d.writeln('      {');
   d.writeln('         if ( (selected_winners[game_index] == "H") || (selected_winners[game_index] == "V") )');
   d.writeln('         {');
   d.writeln('            if (winners_iteration[game_index] != selected_winners[game_index])');
   d.writeln('            {');
   d.writeln('               skip_iteration = true;');
   d.writeln('               break;');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('         else if (selected_winners[game_index] == "Tie")');
   d.writeln('         {');
   d.writeln('            winners_iteration[game_index] = selected_winners[game_index];');
   d.writeln('         }');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      if (skip_iteration == false)');
   d.writeln('      {');
   d.writeln('         // Determine the best outcome for the selected player.');
   d.writeln('');
   d.writeln('         games_won          = 0;');
   d.writeln('         max_opponent_score = 0;');
   d.writeln('         games_won          = 0;');
   d.writeln('         score_difference   = -1000;');
   d.writeln('');
   d.writeln('         selected_player_score = calculate_score(selected_player_picks,selected_player_weights,winners_iteration,number_of_rs_games)');
   d.writeln('');
   d.writeln('         for (var opponent_player_index = 0; opponent_player_index < number_of_rs_players; opponent_player_index++)');
   d.writeln('         {');
   d.writeln('            // Do not compare scores if this iteration of opponent_player_index happens to be the selected_player_index.');
   d.writeln('');
   d.writeln('            if (opponent_player_index != selected_player_index)');
   d.writeln('            {');
   d.writeln('               // Compare scores only if no specific opponent was selected or if a specific opponent was selected and this iteration of opponent_player_index matches the specific opponent.');
   d.writeln('');
   d.writeln('               if ( (selected_opponent_index < 0) || (selected_opponent_index == opponent_player_index) )');
   d.writeln('               {');
   d.writeln('                  opponent_score     = calculate_score(picks[opponent_player_index],weights[opponent_player_index],winners_iteration,number_of_rs_games)');
   d.writeln('                  max_opponent_score = Math.max(max_opponent_score,opponent_score);');  
   d.writeln('                  score_difference   = selected_player_score-max_opponent_score;'); 
   d.writeln('               }');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('');
   d.writeln('         if (score_difference > max_score_difference)');
   d.writeln('         {');
   d.writeln('            max_score_difference = score_difference;');
   d.writeln('            most_games_won       = calculate_games_won(selected_player_picks,selected_player_weights,winners_iteration,number_of_rs_games);');
   d.writeln('');
   d.writeln('            // Set the winners to reflect the best win for the selected player.');
   d.writeln('');
   d.writeln('            for (var game_index = 0; game_index < number_of_rs_games; game_index++)');
   d.writeln('            {');
   d.writeln('               best_winners[game_index] = winners_iteration[game_index];');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('         else if (score_difference == max_score_difference)');
   d.writeln('         {');
   d.writeln('            games_won = calculate_games_won(selected_player_picks,selected_player_weights,winners_iteration,number_of_rs_games);');
   d.writeln('');
   d.writeln('            if (games_won > most_games_won)');
   d.writeln('            {');   
   d.writeln('               most_games_won = games_won;');
   d.writeln('');
   d.writeln('               // Set the winners to reflect the best win for the selected player.');
   d.writeln('');
   d.writeln('               for (var game_index = 0; game_index < number_of_rs_games; game_index++)');
   d.writeln('               {');
   d.writeln('                  best_winners[game_index] = winners_iteration[game_index];');
   d.writeln('               }');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Assign the preliminary winners to the best winners so when we re-display the preliminary form it will reflect the best outcome for the selected player.');
   d.writeln('');
   d.writeln('   for (var game_index = 0; game_index < number_of_rs_games; game_index++)');
   d.writeln('   {');
   d.writeln('      window.top.gv.prelim_winners[game_index] = best_winners[game_index];');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Re-display the preliminary form with the win/loss combination that reflects the best outcome for the selected player.');
   d.writeln('');
   d.writeln('   document.location.href = "fp_regular_season_form.html";');
   d.writeln('');
   d.writeln('   // Make sure cursor is not set to "wait".');
   d.writeln('');
   d.writeln('   document.body.style.cursor = "auto";');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function get_mn_points(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   var results   = document.fp_results;');
   d.writeln('   var mn_points = results.mn_points;');
   d.writeln('');
   d.writeln('');
   d.writeln('   if (mn_points == undefined) return true;');
   d.writeln('');
   d.writeln('   if (isNaN(mn_points.value) == true)');
   d.writeln('   {');
   d.writeln('      mn_points.value = window.top.gv.mn_points_entered;');
   d.writeln('      if (mn_points.value == 0) mn_points.value = " ";');
   d.writeln('      return true;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Allow "0" so that the user can clear the field.');
   d.writeln('');
   d.writeln('   if ( (mn_points.value < 0) || (mn_points.value > 999) )');
   d.writeln('   {');
   d.writeln('      mn_points.value = window.top.gv.mn_points_entered;');
   d.writeln('      if (mn_points.value == 0) mn_points.value = " ";');
   d.writeln('      return true;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   window.top.gv.mn_points_entered = mn_points.value;');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function get_nfl_scores(document,display_dialog,command)');
   d.writeln('{');
   d.writeln('   var nfl_connection = null;');
   d.writeln('   var nfl_scores     = null;');
   d.writeln('   var nfl_scores_url = "site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";');
   d.writeln('   var request_url    = "https://www.scrappintwins.com/cors/" + nfl_scores_url + "?" + (new Date()).getTime();'); // scrappintwins.com provided by Dan M.
   d.writeln('   var user_message   = "\\"Get NFL Scores\\" failed.";');
   d.writeln('');
   d.writeln('');
   d.writeln('   //nfl_scores = {"leagues":[{"id":"28","uid":"s:20~l:28","name":"National Football League","abbreviation":"NFL","slug":"nfl","season":{"year":2020,"startDate":"2020-08-05T07:00Z","endDate":"2021-02-10T07:59Z","type":{"id":"2","type":2,"name":"Regular Season","abbreviation":"reg"}},"calendarType":"list","calendarIsWhitelist":true,"calendarStartDate":"2020-08-05T07:00Z","calendarEndDate":"2021-02-10T07:59Z","calendar":[{"label":"Preseason","value":"1","startDate":"2020-08-05T07:00Z","endDate":"2020-09-09T06:59Z","entries":[{"label":"Hall of Fame Weekend","alternateLabel":"HOF","detail":"Aug 5-11","value":"1","startDate":"2020-08-05T07:00Z","endDate":"2020-08-12T06:59Z"},{"label":"Preseason Week 1","alternateLabel":"Pre Wk 1","detail":"Aug 12-18","value":"2","startDate":"2020-08-12T07:00Z","endDate":"2020-08-19T06:59Z"},{"label":"Preseason Week 2","alternateLabel":"Pre Wk 2","detail":"Aug 19-25","value":"3","startDate":"2020-08-19T07:00Z","endDate":"2020-08-26T06:59Z"},{"label":"Preseason Week 3","alternateLabel":"Pre Wk 3","detail":"Aug 26-Sep 1","value":"4","startDate":"2020-08-26T07:00Z","endDate":"2020-09-02T06:59Z"},{"label":"Preseason Week 4","alternateLabel":"Pre Wk 4","detail":"Sep 2-8","value":"5","startDate":"2020-09-02T07:00Z","endDate":"2020-09-09T06:59Z"}]},{"label":"Regular Season","value":"2","startDate":"2020-09-09T07:00Z","endDate":"2021-01-06T07:59Z","entries":[{"label":"Week 1","alternateLabel":"Week 1","detail":"Sep 9-15","value":"1","startDate":"2020-09-09T07:00Z","endDate":"2020-09-16T06:59Z"},{"label":"Week 2","alternateLabel":"Week 2","detail":"Sep 16-22","value":"2","startDate":"2020-09-16T07:00Z","endDate":"2020-09-23T06:59Z"},{"label":"Week 3","alternateLabel":"Week 3","detail":"Sep 23-29","value":"3","startDate":"2020-09-23T07:00Z","endDate":"2020-09-30T06:59Z"},{"label":"Week 4","alternateLabel":"Week 4","detail":"Sep 30-Oct 6","value":"4","startDate":"2020-09-30T07:00Z","endDate":"2020-10-07T06:59Z"},{"label":"Week 5","alternateLabel":"Week 5","detail":"Oct 7-13","value":"5","startDate":"2020-10-07T07:00Z","endDate":"2020-10-14T06:59Z"},{"label":"Week 6","alternateLabel":"Week 6","detail":"Oct 14-20","value":"6","startDate":"2020-10-14T07:00Z","endDate":"2020-10-21T06:59Z"},{"label":"Week 7","alternateLabel":"Week 7","detail":"Oct 21-27","value":"7","startDate":"2020-10-21T07:00Z","endDate":"2020-10-28T06:59Z"},{"label":"Week 8","alternateLabel":"Week 8","detail":"Oct 28-Nov 3","value":"8","startDate":"2020-10-28T07:00Z","endDate":"2020-11-04T07:59Z"},{"label":"Week 9","alternateLabel":"Week 9","detail":"Nov 4-10","value":"9","startDate":"2020-11-04T08:00Z","endDate":"2020-11-11T07:59Z"},{"label":"Week 10","alternateLabel":"Week 10","detail":"Nov 11-17","value":"10","startDate":"2020-11-11T08:00Z","endDate":"2020-11-18T07:59Z"},{"label":"Week 11","alternateLabel":"Week 11","detail":"Nov 18-24","value":"11","startDate":"2020-11-18T08:00Z","endDate":"2020-11-25T07:59Z"},{"label":"Week 12","alternateLabel":"Week 12","detail":"Nov 25-Dec 1","value":"12","startDate":"2020-11-25T08:00Z","endDate":"2020-12-02T07:59Z"},{"label":"Week 13","alternateLabel":"Week 13","detail":"Dec 2-8","value":"13","startDate":"2020-12-02T08:00Z","endDate":"2020-12-09T07:59Z"},{"label":"Week 14","alternateLabel":"Week 14","detail":"Dec 9-15","value":"14","startDate":"2020-12-09T08:00Z","endDate":"2020-12-16T07:59Z"},{"label":"Week 15","alternateLabel":"Week 15","detail":"Dec 16-22","value":"15","startDate":"2020-12-16T08:00Z","endDate":"2020-12-23T07:59Z"},{"label":"Week 16","alternateLabel":"Week 16","detail":"Dec 23-29","value":"16","startDate":"2020-12-23T08:00Z","endDate":"2020-12-30T07:59Z"},{"label":"Week 17","alternateLabel":"Week 17","detail":"Dec 30-Jan 5","value":"17","startDate":"2020-12-30T08:00Z","endDate":"2021-01-06T07:59Z"}]},{"label":"Postseason","value":"3","startDate":"2021-01-06T08:00Z","endDate":"2021-02-10T07:59Z","entries":[{"label":"Wild Card","alternateLabel":"Wild Card","detail":"Jan 6-12","value":"1","startDate":"2021-01-06T08:00Z","endDate":"2021-01-13T07:59Z"},{"label":"Divisional Round","alternateLabel":"Div Rd","detail":"Jan 13-19","value":"2","startDate":"2021-01-13T08:00Z","endDate":"2021-01-20T07:59Z"},{"label":"Conference Championship","alternateLabel":"Conf Champ","detail":"Jan 20-26","value":"3","startDate":"2021-01-20T08:00Z","endDate":"2021-01-27T07:59Z"},{"label":"Pro Bowl","alternateLabel":"Pro Bowl","detail":"Jan 27-Feb 2","value":"4","startDate":"2021-01-27T08:00Z","endDate":"2021-02-03T07:59Z"},{"label":"Super Bowl","alternateLabel":"Super Bowl","detail":"Feb 3-9","value":"5","startDate":"2021-02-03T08:00Z","endDate":"2021-02-10T07:59Z"}]},{"label":"Off Season","value":"4","startDate":"2021-02-10T08:00Z","endDate":"2021-08-01T06:59Z","entries":[{"label":"Week 1","alternateLabel":"Week 1","detail":"Feb 10-Jul 31","value":"1","startDate":"2021-02-10T08:00Z","endDate":"2021-08-01T06:59Z"}]}]}],"season":{"type":2,"year":2020},"week":{"number":1},"events":[{"id":"401220161","uid":"s:20~l:28~e:401220161","date":"2020-09-13T20:05Z","name":"Los Angeles Chargers at Cincinnati Bengals","shortName":"LAC @ CIN","season":{"year":2020,"type":2},"competitions":[{"id":"401220161","uid":"s:20~l:28~e:401220161~c:401220161","date":"2020-09-13T20:05Z","attendance":0,"type":{"id":"1","abbreviation":"STD"},"timeValid":true,"neutralSite":false,"conferenceCompetition":false,"recent":true,"venue":{"id":"3874","fullName":"Paul Brown Stadium","address":{"city":"Cincinnati","state":"OH"},"capacity":65515,"indoor":false},"competitors":[{"id":"4","uid":"s:20~l:28~t:4","type":"team","order":0,"homeAway":"home","team":{"id":"4","uid":"s:20~l:28~t:4","location":"Cincinnati","name":"Bengals","abbreviation":"CIN","displayName":"Cincinnati Bengals","shortDisplayName":"Bengals","color":"FF2700","alternateColor":"000000","isActive":true,"venue":{"id":"3874"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/cin/cincinnati-bengals","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/cin/cincinnati-bengals","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/cin/cincinnati-bengals","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/cin","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/cin","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:4&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/cin/cincinnati-bengals","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/cin","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/cin","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/cin","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/cin.png"},"score":"0","linescores":[{"value":0.0}],"statistics":[],"records":[{"name":"All Splits","abbreviation":"Any","type":"total","summary":"0-0"},{"name":"Home","type":"home","summary":"0-0"},{"name":"Road","type":"road","summary":"0-0"}]},{"id":"24","uid":"s:20~l:28~t:24","type":"team","order":1,"homeAway":"away","team":{"id":"24","uid":"s:20~l:28~t:24","location":"Los Angeles","name":"Chargers","abbreviation":"LAC","displayName":"Los Angeles Chargers","shortDisplayName":"Chargers","color":"042453","alternateColor":"0073cf","isActive":true,"venue":{"id":"538"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/lac/los-angeles-chargers","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/lac/los-angeles-chargers","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/lac/los-angeles-chargers","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/lac","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/lac","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:24&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/lac/los-angeles-chargers","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/lac","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/lac","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/lac","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/lac.png"},"score":"0","linescores":[{"value":0.0}],"statistics":[],"records":[{"name":"All Splits","abbreviation":"Any","type":"total","summary":"0-0"},{"name":"Home","type":"home","summary":"0-0"},{"name":"Road","type":"road","summary":"0-0"}]}],"notes":[],"situation":{"$ref":"http://sports.core.api.espn.pvt/v2/sports/football/leagues/nfl/events/401220161/competitions/401220161/situation?lang=en&region=us","lastPlay":{"id":"401220161889","type":{"id":"3","text":"Pass Incompletion"},"text":"(2:36) (Shotgun) J.Burrow pass incomplete deep middle to C.Uzomah.","scoreValue":0,"team":{"id":"4"},"probability":{"tiePercentage":0.0,"homeWinPercentage":0.514,"awayWinPercentage":0.486,"secondsLeft":0},"drive":{"description":"4 plays, 21 yards, 1:23","start":{"yardLine":56,"text":"LAC 44"},"timeElapsed":{"displayValue":"1:23"}},"start":{"yardLine":77,"team":{"id":"4"}},"end":{"yardLine":77,"team":{"id":"4"}},"statYardage":0,"athletesInvolved":[{"id":"2574576","fullName":"C.J. Uzomah","displayName":"C.J. Uzomah","shortName":"C.J. Uzomah","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/2574576/cj-uzomah"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/2574576/cj-uzomah"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/2574576/cj-uzomah"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/2574576/cj-uzomah"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/2574576/cj-uzomah"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/2574576/cj-uzomah"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/2574576/cj-uzomah"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/2574576.png","jersey":"87","position":"TE","team":{"id":"4"}}]},"down":2,"yardLine":77,"distance":10,"downDistanceText":"2nd & 10 at LAC 23","shortDownDistanceText":"2nd & 10","possessionText":"LAC 23","isRedZone":false,"homeTimeouts":3,"awayTimeouts":3,"possession":"4"},"status":{"clock":156.0,"displayClock":"2:36","period":1,"type":{"id":"2","name":"STATUS_IN_PROGRESS","state":"in","completed":false,"description":"In Progress","detail":"2:36 - 1st Quarter","shortDetail":"2:36 - 1st"}},"broadcasts":[{"market":"national","names":["CBS"]}],"leaders":[{"name":"passingYards","displayName":"Passing Leader","shortDisplayName":"PASS","abbreviation":"PYDS","leaders":[{"displayValue":"6-10, 39 YDS","value":39.0,"athlete":{"id":"3915511","fullName":"Joe Burrow","displayName":"Joe Burrow","shortName":"J. Burrow","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3915511/joe-burrow"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/3915511/joe-burrow"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/3915511/joe-burrow"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/3915511/joe-burrow"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/3915511/joe-burrow"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/3915511/joe-burrow"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3915511/joe-burrow"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/3915511.png","jersey":"9","position":{"abbreviation":"QB"},"team":{"id":"4"},"active":true},"team":{"id":"4"}}]},{"name":"rushingYards","displayName":"Rushing Leader","shortDisplayName":"RUSH","abbreviation":"RYDS","leaders":[{"displayValue":"4 CAR, 12 YDS","value":12.0,"athlete":{"id":"3116385","fullName":"Joe Mixon","displayName":"Joe Mixon","shortName":"J. Mixon","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3116385/joe-mixon"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/3116385/joe-mixon"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/3116385/joe-mixon"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/3116385/joe-mixon"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/3116385/joe-mixon"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/3116385/joe-mixon"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3116385/joe-mixon"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/3116385.png","jersey":"28","position":{"abbreviation":"RB"},"team":{"id":"4"},"active":true},"team":{"id":"4"}}]},{"name":"receivingYards","displayName":"Receiving Leader","shortDisplayName":"REC","abbreviation":"RECYDS","leaders":[{"displayValue":"3 REC, 28 YDS","value":28.0,"athlete":{"id":"13983","fullName":"A.J. Green","displayName":"A.J. Green","shortName":"A.J. Green","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/13983/aj-green"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/13983/aj-green"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/13983/aj-green"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/13983/aj-green"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/13983/aj-green"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/13983/aj-green"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/13983/aj-green"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/13983.png","jersey":"18","position":{"abbreviation":"WR"},"team":{"id":"4"},"active":true},"team":{"id":"4"}}]}],"startDate":"2020-09-13T20:05Z","geoBroadcasts":[{"type":{"id":"1","shortName":"TV"},"market":{"id":"1","type":"National"},"media":{"shortName":"CBS"},"lang":"en","region":"us"}]}],"links":[{"language":"en-US","rel":["live","desktop","event"],"href":"http://www.espn.com/nfl/game?gameId=401220161","text":"Gamecast","shortText":"Gamecast","isExternal":false,"isPremium":false},{"language":"en-US","rel":["boxscore","desktop","event"],"href":"http://www.espn.com/nfl/boxscore?gameId=401220161","text":"Box Score","shortText":"Box Score","isExternal":false,"isPremium":false},{"language":"en-US","rel":["pbp","desktop","event"],"href":"http://www.espn.com/nfl/playbyplay?gameId=401220161","text":"Play-by-Play","shortText":"Play-by-Play","isExternal":false,"isPremium":false}],"status":{"clock":156.0,"displayClock":"2:36","period":1,"type":{"id":"2","name":"STATUS_IN_PROGRESS","state":"in","completed":false,"description":"In Progress","detail":"2:36 - 1st Quarter","shortDetail":"2:36 - 1st"}}},{"id":"401220369","uid":"s:20~l:28~e:401220369","date":"2020-09-13T20:25Z","name":"Tampa Bay Buccaneers at New Orleans Saints","shortName":"TB @ NO","season":{"year":2020,"type":2},"competitions":[{"id":"401220369","uid":"s:20~l:28~e:401220369~c:401220369","date":"2020-09-13T20:25Z","attendance":0,"type":{"id":"1","abbreviation":"STD"},"timeValid":true,"neutralSite":false,"conferenceCompetition":false,"recent":true,"venue":{"id":"3493","fullName":"Mercedes-Benz Superdome","address":{"city":"New Orleans","state":"LA"},"capacity":73000,"indoor":true},"competitors":[{"id":"18","uid":"s:20~l:28~t:18","type":"team","order":0,"homeAway":"home","team":{"id":"18","uid":"s:20~l:28~t:18","location":"New Orleans","name":"Saints","abbreviation":"NO","displayName":"New Orleans Saints","shortDisplayName":"Saints","color":"020202","alternateColor":"000000","isActive":true,"venue":{"id":"3493"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/no/new-orleans-saints","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/no/new-orleans-saints","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/no/new-orleans-saints","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/no","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/no","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:18&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/no/new-orleans-saints","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/no","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/no","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/no","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/no.png"},"score":"0","linescores":[{"value":0.0}],"statistics":[],"records":[{"name":"All Splits","abbreviation":"Any","type":"total","summary":"0-0"},{"name":"Home","type":"home","summary":"0-0"},{"name":"Road","type":"road","summary":"0-0"}]},{"id":"27","uid":"s:20~l:28~t:27","type":"team","order":1,"homeAway":"away","team":{"id":"27","uid":"s:20~l:28~t:27","location":"Tampa Bay","name":"Buccaneers","abbreviation":"TB","displayName":"Tampa Bay Buccaneers","shortDisplayName":"Buccaneers","color":"A80D08","alternateColor":"34302b","isActive":true,"venue":{"id":"3886"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/tb/tampa-bay-buccaneers","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/tb/tampa-bay-buccaneers","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/tb/tampa-bay-buccaneers","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/tb","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/tb","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:27&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/tb/tampa-bay-buccaneers","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/tb","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/tb","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/tb","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/tb.png"},"score":"7","linescores":[{"value":7.0}],"statistics":[],"records":[{"name":"All Splits","abbreviation":"Any","type":"total","summary":"0-0"},{"name":"Home","type":"home","summary":"0-0"},{"name":"Road","type":"road","summary":"0-0"}]}],"notes":[],"situation":{"$ref":"http://sports.core.api.espn.pvt/v2/sports/football/leagues/nfl/events/401220369/competitions/401220369/situation?lang=en&region=us","lastPlay":{"id":"401220369588","type":{"id":"24","text":"Pass Reception","abbreviation":"REC"},"text":"(5:08) (Shotgun) D.Brees pass short right to J.Cook to NO 43 for 1 yard (S.Murphy-Bunting).","scoreValue":0,"team":{"id":"18"},"probability":{"tiePercentage":0.0,"homeWinPercentage":0.329,"awayWinPercentage":0.671,"secondsLeft":0},"drive":{"description":"5 plays, 18 yards, 2:19","start":{"yardLine":25,"text":"NO 25"},"timeElapsed":{"displayValue":"2:19"}},"start":{"yardLine":42,"team":{"id":"18"}},"end":{"yardLine":43,"team":{"id":"18"}},"statYardage":1,"athletesInvolved":[{"id":"12537","fullName":"Jared Cook","displayName":"Jared Cook","shortName":"J. Cook","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/12537/jared-cook"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/12537/jared-cook"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/12537/jared-cook"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/12537/jared-cook"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/12537/jared-cook"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/12537/jared-cook"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/12537/jared-cook"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/12537.png","jersey":"87","position":"TE","team":{"id":"18"}}]},"down":4,"yardLine":43,"distance":3,"downDistanceText":"4th & 3 at NO 43","shortDownDistanceText":"4th & 3","possessionText":"NO 43","isRedZone":false,"homeTimeouts":3,"awayTimeouts":3,"possession":"18"},"status":{"clock":308.0,"displayClock":"5:08","period":1,"type":{"id":"2","name":"STATUS_IN_PROGRESS","state":"in","completed":false,"description":"In Progress","detail":"5:08 - 1st Quarter","shortDetail":"5:08 - 1st"}},"broadcasts":[{"market":"national","names":["FOX"]}],"leaders":[{"name":"passingYards","displayName":"Passing Leader","shortDisplayName":"PASS","abbreviation":"PYDS","leaders":[{"displayValue":"2-2, 37 YDS","value":37.0,"athlete":{"id":"2330","fullName":"Tom Brady","displayName":"Tom Brady","shortName":"T. Brady","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/2330/tom-brady"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/2330/tom-brady"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/2330/tom-brady"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/2330/tom-brady"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/2330/tom-brady"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/2330/tom-brady"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/2330/tom-brady"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/2330.png","jersey":"12","position":{"abbreviation":"QB"},"team":{"id":"27"},"active":true},"team":{"id":"27"}}]},{"name":"rushingYards","displayName":"Rushing Leader","shortDisplayName":"RUSH","abbreviation":"RYDS","leaders":[{"displayValue":"5 CAR, 12 YDS","value":12.0,"athlete":{"id":"3912550","fullName":"Ronald Jones II","displayName":"Ronald Jones II","shortName":"R. Jones II","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3912550/ronald-jones-ii"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/3912550/ronald-jones-ii"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/3912550/ronald-jones-ii"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/3912550/ronald-jones-ii"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/3912550/ronald-jones-ii"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/3912550/ronald-jones-ii"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3912550/ronald-jones-ii"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/3912550.png","jersey":"27","position":{"abbreviation":"RB"},"team":{"id":"27"},"active":true},"team":{"id":"27"}}]},{"name":"receivingYards","displayName":"Receiving Leader","shortDisplayName":"REC","abbreviation":"RECYDS","leaders":[{"displayValue":"1 REC, 29 YDS","value":29.0,"athlete":{"id":"3116165","fullName":"Chris Godwin","displayName":"Chris Godwin","shortName":"C. Godwin","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3116165/chris-godwin"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/3116165/chris-godwin"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/3116165/chris-godwin"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/3116165/chris-godwin"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/3116165/chris-godwin"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/3116165/chris-godwin"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3116165/chris-godwin"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/3116165.png","jersey":"14","position":{"abbreviation":"WR"},"team":{"id":"27"},"active":true},"team":{"id":"27"}}]}],"startDate":"2020-09-13T20:25Z","geoBroadcasts":[{"type":{"id":"1","shortName":"TV"},"market":{"id":"1","type":"National"},"media":{"shortName":"FOX"},"lang":"en","region":"us"}]}],"links":[{"language":"en-US","rel":["live","desktop","event"],"href":"http://www.espn.com/nfl/game?gameId=401220369","text":"Gamecast","shortText":"Gamecast","isExternal":false,"isPremium":false},{"language":"en-US","rel":["boxscore","desktop","event"],"href":"http://www.espn.com/nfl/boxscore?gameId=401220369","text":"Box Score","shortText":"Box Score","isExternal":false,"isPremium":false},{"language":"en-US","rel":["pbp","desktop","event"],"href":"http://www.espn.com/nfl/playbyplay?gameId=401220369","text":"Play-by-Play","shortText":"Play-by-Play","isExternal":false,"isPremium":false}],"status":{"clock":308.0,"displayClock":"5:08","period":1,"type":{"id":"2","name":"STATUS_IN_PROGRESS","state":"in","completed":false,"description":"In Progress","detail":"5:08 - 1st Quarter","shortDetail":"5:08 - 1st"}}},{"id":"401220352","uid":"s:20~l:28~e:401220352","date":"2020-09-13T20:25Z","name":"Arizona Cardinals at San Francisco 49ers","shortName":"ARI @ SF","season":{"year":2020,"type":2},"competitions":[{"id":"401220352","uid":"s:20~l:28~e:401220352~c:401220352","date":"2020-09-13T20:25Z","attendance":0,"type":{"id":"1","abbreviation":"STD"},"timeValid":true,"neutralSite":false,"conferenceCompetition":false,"recent":true,"venue":{"id":"4738","fullName":"Levis Stadium","address":{"city":"Santa Clara","state":"CA"},"capacity":68500,"indoor":false},"competitors":[{"id":"25","uid":"s:20~l:28~t:25","type":"team","order":0,"homeAway":"home","team":{"id":"25","uid":"s:20~l:28~t:25","location":"San Francisco","name":"49ers","abbreviation":"SF","displayName":"San Francisco 49ers","shortDisplayName":"49ers","color":"981324","alternateColor":"b3995d","isActive":true,"venue":{"id":"4738"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/sf/san-francisco-49ers","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/sf/san-francisco-49ers","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/sf/san-francisco-49ers","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/sf","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/sf","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:25&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/sf/san-francisco-49ers","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/sf","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/sf","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/sf","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/sf.png"},"score":"10","linescores":[{"value":10.0}],"statistics":[],"records":[{"name":"All Splits","abbreviation":"Any","type":"total","summary":"0-0"},{"name":"Home","type":"home","summary":"0-0"},{"name":"Road","type":"road","summary":"0-0"}]},{"id":"22","uid":"s:20~l:28~t:22","type":"team","order":1,"homeAway":"away","team":{"id":"22","uid":"s:20~l:28~t:22","location":"Arizona","name":"Cardinals","abbreviation":"ARI","displayName":"Arizona Cardinals","shortDisplayName":"Cardinals","color":"A40227","alternateColor":"000000","isActive":true,"venue":{"id":"3970"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/ari/arizona-cardinals","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/ari/arizona-cardinals","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/ari/arizona-cardinals","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/ari","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/ari","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:22&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/ari/arizona-cardinals","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/ari","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/ari","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/ari","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/ari.png"},"score":"0","linescores":[{"value":0.0}],"statistics":[],"records":[{"name":"All Splits","abbreviation":"Any","type":"total","summary":"0-0"},{"name":"Home","type":"home","summary":"0-0"},{"name":"Road","type":"road","summary":"0-0"}]}],"notes":[],"situation":{"$ref":"http://sports.core.api.espn.pvt/v2/sports/football/leagues/nfl/events/401220352/competitions/401220352/situation?lang=en&region=us","lastPlay":{"id":"401220352491","type":{"id":"24","text":"Pass Reception","abbreviation":"REC"},"text":"(9:53) (Shotgun) K.Murray pass short left to D.Hopkins to ARZ 26 for 1 yard (R.Sherman).","scoreValue":0,"team":{"id":"22"},"probability":{"tiePercentage":0.0,"homeWinPercentage":0.859,"awayWinPercentage":0.14100000000000001,"secondsLeft":0},"drive":{"description":"1 play, 1 yard, 0:14","start":{"yardLine":75,"text":"ARI 25"},"timeElapsed":{"displayValue":"0:14"}},"start":{"yardLine":75,"team":{"id":"22"}},"end":{"yardLine":74,"team":{"id":"22"}},"statYardage":1,"athletesInvolved":[{"id":"15795","fullName":"DeAndre Hopkins","displayName":"DeAndre Hopkins","shortName":"D. Hopkins","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/15795/deandre-hopkins"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/15795/deandre-hopkins"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/15795/deandre-hopkins"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/15795/deandre-hopkins"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/15795/deandre-hopkins"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/15795/deandre-hopkins"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/15795/deandre-hopkins"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/15795.png","jersey":"10","position":"WR","team":{"id":"22"}}]},"down":2,"yardLine":74,"distance":9,"downDistanceText":"2nd & 9 at ARI 26","shortDownDistanceText":"2nd & 9","possessionText":"ARI 26","isRedZone":false,"homeTimeouts":3,"awayTimeouts":3,"possession":"22"},"status":{"clock":579.0,"displayClock":"9:39","period":1,"type":{"id":"2","name":"STATUS_IN_PROGRESS","state":"in","completed":false,"description":"In Progress","detail":"9:39 - 1st Quarter","shortDetail":"9:39 - 1st"}},"broadcasts":[{"market":"national","names":["FOX"]}],"leaders":[{"name":"passingYards","displayName":"Passing Leader","shortDisplayName":"PASS","abbreviation":"PYDS","leaders":[{"displayValue":"3-3, 92 YDS, 1 TD","value":92.0,"athlete":{"id":"16760","fullName":"Jimmy Garoppolo","displayName":"Jimmy Garoppolo","shortName":"J. Garoppolo","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/16760/jimmy-garoppolo"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/16760/jimmy-garoppolo"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/16760/jimmy-garoppolo"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/16760/jimmy-garoppolo"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/16760/jimmy-garoppolo"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/16760/jimmy-garoppolo"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/16760/jimmy-garoppolo"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/16760.png","jersey":"10","position":{"abbreviation":"QB"},"team":{"id":"25"},"active":true},"team":{"id":"25"}}]},{"name":"rushingYards","displayName":"Rushing Leader","shortDisplayName":"RUSH","abbreviation":"RYDS","leaders":[{"displayValue":"3 CAR, 10 YDS","value":10.0,"athlete":{"id":"2576414","fullName":"Raheem Mostert","displayName":"Raheem Mostert","shortName":"R. Mostert","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/2576414/raheem-mostert"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/2576414/raheem-mostert"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/2576414/raheem-mostert"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/2576414/raheem-mostert"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/2576414/raheem-mostert"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/2576414/raheem-mostert"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/2576414/raheem-mostert"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/2576414.png","jersey":"31","position":{"abbreviation":"RB"},"team":{"id":"25"},"active":true},"team":{"id":"25"}}]},{"name":"receivingYards","displayName":"Receiving Leader","shortDisplayName":"REC","abbreviation":"RECYDS","leaders":[{"displayValue":"1 REC, 76 YDS, 1 TD","value":76.0,"athlete":{"id":"2576414","fullName":"Raheem Mostert","displayName":"Raheem Mostert","shortName":"R. Mostert","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/2576414/raheem-mostert"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/2576414/raheem-mostert"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/2576414/raheem-mostert"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/2576414/raheem-mostert"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/2576414/raheem-mostert"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/2576414/raheem-mostert"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/2576414/raheem-mostert"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/2576414.png","jersey":"31","position":{"abbreviation":"RB"},"team":{"id":"25"},"active":true},"team":{"id":"25"}}]}],"startDate":"2020-09-13T20:25Z","geoBroadcasts":[{"type":{"id":"1","shortName":"TV"},"market":{"id":"1","type":"National"},"media":{"shortName":"FOX"},"lang":"en","region":"us"}]}],"links":[{"language":"en-US","rel":["live","desktop","event"],"href":"http://www.espn.com/nfl/game?gameId=401220352","text":"Gamecast","shortText":"Gamecast","isExternal":false,"isPremium":false},{"language":"en-US","rel":["boxscore","desktop","event"],"href":"http://www.espn.com/nfl/boxscore?gameId=401220352","text":"Box Score","shortText":"Box Score","isExternal":false,"isPremium":false},{"language":"en-US","rel":["pbp","desktop","event"],"href":"http://www.espn.com/nfl/playbyplay?gameId=401220352","text":"Play-by-Play","shortText":"Play-by-Play","isExternal":false,"isPremium":false}],"status":{"clock":579.0,"displayClock":"9:39","period":1,"type":{"id":"2","name":"STATUS_IN_PROGRESS","state":"in","completed":false,"description":"In Progress","detail":"9:39 - 1st Quarter","shortDetail":"9:39 - 1st"}}},{"id":"401220313","uid":"s:20~l:28~e:401220313","date":"2020-09-13T17:00Z","name":"Seattle Seahawks at Atlanta Falcons","shortName":"SEA @ ATL","season":{"year":2020,"type":2},"competitions":[{"id":"401220313","uid":"s:20~l:28~e:401220313~c:401220313","date":"2020-09-13T17:00Z","attendance":0,"type":{"id":"1","abbreviation":"STD"},"timeValid":true,"neutralSite":false,"conferenceCompetition":false,"recent":true,"venue":{"id":"5348","fullName":"Mercedes-Benz Stadium","address":{"city":"Atlanta","state":"GA"},"capacity":75000,"indoor":true},"competitors":[{"id":"1","uid":"s:20~l:28~t:1","type":"team","order":0,"homeAway":"home","winner":false,"team":{"id":"1","uid":"s:20~l:28~t:1","location":"Atlanta","name":"Falcons","abbreviation":"ATL","displayName":"Atlanta Falcons","shortDisplayName":"Falcons","color":"000000","alternateColor":"000000","isActive":true,"venue":{"id":"5348"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/atl/atlanta-falcons","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/atl/atlanta-falcons","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/atl/atlanta-falcons","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/atl","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/atl","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:1&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/atl/atlanta-falcons","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/atl","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/atl","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/atl","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/atl.png"},"score":"25","linescores":[{"value":3.0},{"value":9.0},{"value":0.0},{"value":13.0}],"statistics":[],"records":[{"name":"YTD","abbreviation":"Game","type":"total","summary":"0-1"},{"name":"Home","type":"home","summary":"0-1"},{"name":"Road","type":"road","summary":"0-0"}]},{"id":"26","uid":"s:20~l:28~t:26","type":"team","order":1,"homeAway":"away","winner":true,"team":{"id":"26","uid":"s:20~l:28~t:26","location":"Seattle","name":"Seahawks","abbreviation":"SEA","displayName":"Seattle Seahawks","shortDisplayName":"Seahawks","color":"224970","alternateColor":"69be28","isActive":true,"venue":{"id":"3673"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/sea/seattle-seahawks","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/sea/seattle-seahawks","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/sea/seattle-seahawks","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/sea","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/sea","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:26&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/sea/seattle-seahawks","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/sea","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/sea","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/sea","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/sea.png"},"score":"38","linescores":[{"value":14.0},{"value":0.0},{"value":14.0},{"value":10.0}],"statistics":[],"records":[{"name":"YTD","abbreviation":"Game","type":"total","summary":"1-0"},{"name":"Home","type":"home","summary":"0-0"},{"name":"Road","type":"road","summary":"1-0"}]}],"notes":[],"status":{"clock":0.0,"displayClock":"0:00","period":4,"type":{"id":"3","name":"STATUS_FINAL","state":"post","completed":true,"description":"Final","detail":"Final","shortDetail":"Final"}},"broadcasts":[{"market":"national","names":["FOX"]}],"leaders":[{"name":"passingYards","displayName":"Passing Leader","shortDisplayName":"PASS","abbreviation":"PYDS","leaders":[{"displayValue":"37-54, 450 YDS, 2 TD, 1 INT","value":450.0,"athlete":{"id":"11237","fullName":"Matt Ryan","displayName":"Matt Ryan","shortName":"M. Ryan","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/11237/matt-ryan"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/11237/matt-ryan"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/11237/matt-ryan"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/11237/matt-ryan"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/11237/matt-ryan"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/11237/matt-ryan"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/11237/matt-ryan"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/11237.png","jersey":"2","position":{"abbreviation":"QB"},"team":{"id":"1"},"active":true},"team":{"id":"1"}}]},{"name":"rushingYards","displayName":"Rushing Leader","shortDisplayName":"RUSH","abbreviation":"RYDS","leaders":[{"displayValue":"14 CAR, 56 YDS, 1 TD","value":56.0,"athlete":{"id":"2977644","fullName":"Todd Gurley II","displayName":"Todd Gurley II","shortName":"T. Gurley II","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/2977644/todd-gurley-ii"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/2977644/todd-gurley-ii"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/2977644/todd-gurley-ii"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/2977644/todd-gurley-ii"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/2977644/todd-gurley-ii"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/2977644/todd-gurley-ii"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/2977644/todd-gurley-ii"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/2977644.png","jersey":"21","position":{"abbreviation":"RB"},"team":{"id":"1"},"active":true},"team":{"id":"1"}}]},{"name":"receivingYards","displayName":"Receiving Leader","shortDisplayName":"REC","abbreviation":"RECYDS","leaders":[{"displayValue":"9 REC, 157 YDS","value":157.0,"athlete":{"id":"13982","fullName":"Julio Jones","displayName":"Julio Jones","shortName":"J. Jones","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/13982/julio-jones"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/13982/julio-jones"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/13982/julio-jones"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/13982/julio-jones"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/13982/julio-jones"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/13982/julio-jones"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/13982/julio-jones"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/13982.png","jersey":"11","position":{"abbreviation":"WR"},"team":{"id":"1"},"active":true},"team":{"id":"1"}}]}],"startDate":"2020-09-13T17:00Z","geoBroadcasts":[{"type":{"id":"1","shortName":"TV"},"market":{"id":"1","type":"National"},"media":{"shortName":"FOX"},"lang":"en","region":"us"}],"headlines":[{"description":"Russell Wilson was cooking right from the start, throwing four touchdown passes to lead the Seattle Seahawks to a 38-25 victory over the Atlanta Falcons in the season opener Sunday.","type":"Recap","shortLinkText":"Wilson throws 4 TD passes, Seahawks beat Falcons 38-25","video":[{"id":29879033,"source":"espn","headline":"Wilson hits Olsen for perfect TD","thumbnail":"https://a.espncdn.com/media/motion/2020/0913/dm_200913_nfl_rev_1_wilson_hits_olsen_for_td/dm_200913_nfl_rev_1_wilson_hits_olsen_for_td.jpg","duration":17,"tracking":{"sportName":"nfl","leagueName":"No League","coverageType":"Final Game Highlight","trackingName":"*UNPUB 9/15* NFL_One-Play (Wilson hits Olsen for perfect TD) 2020/9/13 ESHEET","trackingId":"dm_200913_nfl_rev_1_wilson_hits_olsen_for_td"},"deviceRestrictions":{"type":"whitelist","devices":["desktop","settop","handset","tablet"]},"geoRestrictions":{"type":"whitelist","countries":["HT","NA","GD","SR","LC","TT","CN","BZ","KY","GY","BS","GP","JM","MQ","FJ","MH","KE","NZ","US","AS","GU","MP","PR","VI","UM","BQ","BM","PW","ZM","KN","SX","VC","CD","AU","TZ","AI","LS","UG","VG","TC","FM","GB","UK","MW","AW","BW","GH","NG","RW","GF","MS","AG","ZW","BB"]},"links":{"api":{"self":{"href":"http://api.espn.com/v1/video/clips/29879033"},"artwork":{"href":"https://artwork.api.espn.com/artwork/collections/media/5c105cd3-88ab-401d-afe8-8c1347ccfa01"}},"web":{"href":"http://espn.go.com/video/clip?id=29879033&ex_cid=espnapi_internal","short":{"href":"https://es.pn/2ZAYJ8b"},"self":{"href":"http://espn.go.com/video/clip?id=29879033&ex_cid=espnapi_internal"}},"source":{"mezzanine":{"href":"https://media.video-origin.espn.com/espnvideo/2020/0913/dm_200913_nfl_rev_1_wilson_hits_olsen_for_td/dm_200913_nfl_rev_1_wilson_hits_olsen_for_td.mp4"},"flash":{"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_nfl_rev_1_wilson_hits_olsen_for_td/dm_200913_nfl_rev_1_wilson_hits_olsen_for_td.smil"},"hds":{"href":"https://hds.video-cdn.espn.com/z/motion/2020/0913/dm_200913_nfl_rev_1_wilson_hits_olsen_for_td/dm_200913_nfl_rev_1_wilson_hits_olsen_for_td_rel.smil/manifest.f4m"},"HLS":{"href":"https://espnpackaging-vh.akamaihd.net/i/motion/2020/0913/dm_200913_nfl_rev_1_wilson_hits_olsen_for_td/dm_200913_nfl_rev_1_wilson_hits_olsen_for_td.smil/master.m3u8","HD":{"href":"https://espnpackaging-vh.akamaihd.net/i/motion/2020/0913/dm_200913_nfl_rev_1_wilson_hits_olsen_for_td/dm_200913_nfl_rev_1_wilson_hits_olsen_for_td.smil/master.m3u8"}},"HD":{"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_nfl_rev_1_wilson_hits_olsen_for_td/dm_200913_nfl_rev_1_wilson_hits_olsen_for_td_720p30_2896k.mp4"},"full":{"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_nfl_rev_1_wilson_hits_olsen_for_td/dm_200913_nfl_rev_1_wilson_hits_olsen_for_td_360p30_1464k.mp4"},"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_nfl_rev_1_wilson_hits_olsen_for_td/dm_200913_nfl_rev_1_wilson_hits_olsen_for_td_360p30_1464k.mp4"},"mobile":{"alert":{"href":"http://m.espn.go.com/general/video/videoAlert?vid=29879033&ex_cid=espnapi_internal"},"source":{"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_nfl_rev_1_wilson_hits_olsen_for_td/dm_200913_nfl_rev_1_wilson_hits_olsen_for_td.mp4"},"href":"https://watch.auth.api.espn.com/video/auth/brightcove/5c105cd3-88ab-401d-afe8-8c1347ccfa01/asset?UMADPARAMreferer=http://espn.go.com/video/clip?id=29879033&ex_cid=espnapi_internal","streaming":{"href":"https://watch.auth.api.espn.com/video/auth/brightcove/5c105cd3-88ab-401d-afe8-8c1347ccfa01/asset?UMADPARAMreferer=http://espn.go.com/video/clip?id=29879033&ex_cid=espnapi_internal"},"progressiveDownload":{"href":"https://watch.auth.api.espn.com/video/auth/brightcove/5c105cd3-88ab-401d-afe8-8c1347ccfa01/asset?UMADPARAMreferer=http://espn.go.com/video/clip?id=29879033&ex_cid=espnapi_internal"}}}}]}]}],"links":[{"language":"en-US","rel":["summary","desktop","event"],"href":"http://www.espn.com/nfl/game/_/gameId/401220313","text":"Gamecast","shortText":"Gamecast","isExternal":false,"isPremium":false},{"language":"en-US","rel":["boxscore","desktop","event"],"href":"http://www.espn.com/nfl/boxscore?gameId=401220313","text":"Box Score","shortText":"Box Score","isExternal":false,"isPremium":false},{"language":"en-US","rel":["highlights","desktop"],"href":"http://www.espn.com/nfl/video?gameId=401220313","text":"Highlights","shortText":"Highlights","isExternal":false,"isPremium":false},{"language":"en-US","rel":["pbp","desktop","event"],"href":"http://www.espn.com/nfl/playbyplay?gameId=401220313","text":"Play-by-Play","shortText":"Play-by-Play","isExternal":false,"isPremium":false},{"language":"en-US","rel":["recap","desktop","event"],"href":"http://www.espn.com/nfl/recap?gameId=401220313","text":"Recap","shortText":"Recap","isExternal":false,"isPremium":false}],"status":{"clock":0.0,"displayClock":"0:00","period":4,"type":{"id":"3","name":"STATUS_FINAL","state":"post","completed":true,"description":"Final","detail":"Final","shortDetail":"Final"}}},{"id":"401220116","uid":"s:20~l:28~e:401220116","date":"2020-09-13T17:00Z","name":"New York Jets at Buffalo Bills","shortName":"NYJ @ BUF","season":{"year":2020,"type":2},"competitions":[{"id":"401220116","uid":"s:20~l:28~e:401220116~c:401220116","date":"2020-09-13T17:00Z","attendance":0,"type":{"id":"1","abbreviation":"STD"},"timeValid":true,"neutralSite":false,"conferenceCompetition":false,"recent":true,"venue":{"id":"3883","fullName":"Bills Stadium","address":{"city":"Orchard Park","state":"NY"},"capacity":71621,"indoor":false},"competitors":[{"id":"2","uid":"s:20~l:28~t:2","type":"team","order":0,"homeAway":"home","winner":true,"team":{"id":"2","uid":"s:20~l:28~t:2","location":"Buffalo","name":"Bills","abbreviation":"BUF","displayName":"Buffalo Bills","shortDisplayName":"Bills","color":"04407F","alternateColor":"c60c30","isActive":true,"venue":{"id":"3883"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/buf/buffalo-bills","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/buf/buffalo-bills","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/buf/buffalo-bills","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/buf","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/buf","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:2&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/buf/buffalo-bills","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/buf","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/buf","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/buf","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/buf.png"},"score":"27","linescores":[{"value":14.0},{"value":7.0},{"value":0.0},{"value":6.0}],"statistics":[],"records":[{"name":"YTD","abbreviation":"Game","type":"total","summary":"1-0"},{"name":"Home","type":"home","summary":"1-0"},{"name":"Road","type":"road","summary":"0-0"}]},{"id":"20","uid":"s:20~l:28~t:20","type":"team","order":1,"homeAway":"away","winner":false,"team":{"id":"20","uid":"s:20~l:28~t:20","location":"New York","name":"Jets","abbreviation":"NYJ","displayName":"New York Jets","shortDisplayName":"Jets","color":"174032","alternateColor":"ffffff","isActive":true,"venue":{"id":"3839"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/nyj/new-york-jets","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/nyj/new-york-jets","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/nyj/new-york-jets","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/nyj","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/nyj","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:20&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/nyj/new-york-jets","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/nyj","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/nyj","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/nyj","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/nyj.png"},"score":"17","linescores":[{"value":0.0},{"value":3.0},{"value":7.0},{"value":7.0}],"statistics":[],"records":[{"name":"YTD","abbreviation":"Game","type":"total","summary":"0-1"},{"name":"Home","type":"home","summary":"0-0"},{"name":"Road","type":"road","summary":"0-1"}]}],"notes":[],"status":{"clock":0.0,"displayClock":"0:00","period":4,"type":{"id":"3","name":"STATUS_FINAL","state":"post","completed":true,"description":"Final","detail":"Final","shortDetail":"Final"}},"broadcasts":[{"market":"national","names":["CBS"]}],"leaders":[{"name":"passingYards","displayName":"Passing Leader","shortDisplayName":"PASS","abbreviation":"PYDS","leaders":[{"displayValue":"33-46, 312 YDS, 2 TD","value":312.0,"athlete":{"id":"3918298","fullName":"Josh Allen","displayName":"Josh Allen","shortName":"J. Allen","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3918298/josh-allen"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/3918298/josh-allen"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/3918298/josh-allen"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/3918298/josh-allen"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/3918298/josh-allen"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/3918298/josh-allen"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3918298/josh-allen"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/3918298.png","jersey":"17","position":{"abbreviation":"QB"},"team":{"id":"2"},"active":true},"team":{"id":"2"}}]},{"name":"rushingYards","displayName":"Rushing Leader","shortDisplayName":"RUSH","abbreviation":"RYDS","leaders":[{"displayValue":"14 CAR, 57 YDS, 1 TD","value":57.0,"athlete":{"id":"3918298","fullName":"Josh Allen","displayName":"Josh Allen","shortName":"J. Allen","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3918298/josh-allen"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/3918298/josh-allen"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/3918298/josh-allen"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/3918298/josh-allen"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/3918298/josh-allen"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/3918298/josh-allen"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3918298/josh-allen"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/3918298.png","jersey":"17","position":{"abbreviation":"QB"},"team":{"id":"2"},"active":true},"team":{"id":"2"}}]},{"name":"receivingYards","displayName":"Receiving Leader","shortDisplayName":"REC","abbreviation":"RECYDS","leaders":[{"displayValue":"7 REC, 115 YDS, 1 TD","value":115.0,"athlete":{"id":"2576716","fullName":"Jamison Crowder","displayName":"Jamison Crowder","shortName":"J. Crowder","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/2576716/jamison-crowder"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/2576716/jamison-crowder"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/2576716/jamison-crowder"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/2576716/jamison-crowder"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/2576716/jamison-crowder"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/2576716/jamison-crowder"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/2576716/jamison-crowder"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/2576716.png","jersey":"82","position":{"abbreviation":"WR"},"team":{"id":"20"},"active":true},"team":{"id":"20"}}]}],"startDate":"2020-09-13T17:00Z","geoBroadcasts":[{"type":{"id":"1","shortName":"TV"},"market":{"id":"1","type":"National"},"media":{"shortName":"CBS"},"lang":"en","region":"us"}],"headlines":[{"description":"Josh Allen led three consecutive first-half touchdown drives, and the Buffalo Bills overcame their own sloppiness and injuries to two starting linebackers in a 27-17 season-opening win over the New York Jets on Sunday.","type":"Recap","shortLinkText":"Allen tops 300 yards passing in Bills 27-17 win over Jets","video":[{"id":29878854,"source":"espn","headline":"Allen accounts for three TDs in Bills win","thumbnail":"https://a.espncdn.com/media/motion/2020/0913/dm_200913_Josh_Allen_SOT_vs_Jets/dm_200913_Josh_Allen_SOT_vs_Jets.jpg","duration":63,"tracking":{"sportName":"nfl","leagueName":"No League","coverageType":"Final Game Highlight","trackingName":"*UNPUB 9/15* COM_NFL Highlight (Allen accounts for three TDs in Bills’ win) 2020/9/13 ESHEET SOTFULL","trackingId":"dm_200913_Josh_Allen_SOT_vs_Jets"},"deviceRestrictions":{"type":"whitelist","devices":["desktop","settop","handset","tablet"]},"geoRestrictions":{"type":"whitelist","countries":["HT","NA","GD","SR","LC","TT","CN","BZ","KY","GY","BS","GP","JM","MQ","FJ","MH","KE","NZ","US","AS","GU","MP","PR","VI","UM","BQ","BM","PW","ZM","KN","SX","VC","CD","AU","TZ","AI","LS","UG","VG","TC","FM","GB","UK","MW","AW","BW","GH","NG","RW","GF","MS","AG","ZW","BB"]},"links":{"api":{"self":{"href":"http://api.espn.com/v1/video/clips/29878854"},"artwork":{"href":"https://artwork.api.espn.com/artwork/collections/media/6d8fb989-8599-4fbd-9799-99ddb3b88300"}},"web":{"href":"http://espn.go.com/video/clip?id=29878854&ex_cid=espnapi_internal","short":{"href":"https://es.pn/35uaiSx"},"self":{"href":"http://espn.go.com/video/clip?id=29878854&ex_cid=espnapi_internal"}},"source":{"mezzanine":{"href":"https://media.video-origin.espn.com/espnvideo/2020/0913/dm_200913_Josh_Allen_SOT_vs_Jets/dm_200913_Josh_Allen_SOT_vs_Jets.mp4"},"flash":{"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_Josh_Allen_SOT_vs_Jets/dm_200913_Josh_Allen_SOT_vs_Jets.smil"},"hds":{"href":"https://hds.video-cdn.espn.com/z/motion/2020/0913/dm_200913_Josh_Allen_SOT_vs_Jets/dm_200913_Josh_Allen_SOT_vs_Jets_rel.smil/manifest.f4m"},"HLS":{"href":"https://espnpackaging-vh.akamaihd.net/i/motion/2020/0913/dm_200913_Josh_Allen_SOT_vs_Jets/dm_200913_Josh_Allen_SOT_vs_Jets.smil/master.m3u8","HD":{"href":"https://espnpackaging-vh.akamaihd.net/i/motion/2020/0913/dm_200913_Josh_Allen_SOT_vs_Jets/dm_200913_Josh_Allen_SOT_vs_Jets.smil/master.m3u8"}},"HD":{"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_Josh_Allen_SOT_vs_Jets/dm_200913_Josh_Allen_SOT_vs_Jets_720p30_2896k.mp4"},"full":{"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_Josh_Allen_SOT_vs_Jets/dm_200913_Josh_Allen_SOT_vs_Jets_360p30_1464k.mp4"},"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_Josh_Allen_SOT_vs_Jets/dm_200913_Josh_Allen_SOT_vs_Jets_360p30_1464k.mp4"},"mobile":{"alert":{"href":"http://m.espn.go.com/general/video/videoAlert?vid=29878854&ex_cid=espnapi_internal"},"source":{"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_Josh_Allen_SOT_vs_Jets/dm_200913_Josh_Allen_SOT_vs_Jets.mp4"},"href":"https://watch.auth.api.espn.com/video/auth/brightcove/6d8fb989-8599-4fbd-9799-99ddb3b88300/asset?UMADPARAMreferer=http://espn.go.com/video/clip?id=29878854&ex_cid=espnapi_internal","streaming":{"href":"https://watch.auth.api.espn.com/video/auth/brightcove/6d8fb989-8599-4fbd-9799-99ddb3b88300/asset?UMADPARAMreferer=http://espn.go.com/video/clip?id=29878854&ex_cid=espnapi_internal"},"progressiveDownload":{"href":"https://watch.auth.api.espn.com/video/auth/brightcove/6d8fb989-8599-4fbd-9799-99ddb3b88300/asset?UMADPARAMreferer=http://espn.go.com/video/clip?id=29878854&ex_cid=espnapi_internal"}}}}]}]}],"links":[{"language":"en-US","rel":["summary","desktop","event"],"href":"http://www.espn.com/nfl/game/_/gameId/401220116","text":"Gamecast","shortText":"Gamecast","isExternal":false,"isPremium":false},{"language":"en-US","rel":["boxscore","desktop","event"],"href":"http://www.espn.com/nfl/boxscore?gameId=401220116","text":"Box Score","shortText":"Box Score","isExternal":false,"isPremium":false},{"language":"en-US","rel":["highlights","desktop"],"href":"http://www.espn.com/nfl/video?gameId=401220116","text":"Highlights","shortText":"Highlights","isExternal":false,"isPremium":false},{"language":"en-US","rel":["pbp","desktop","event"],"href":"http://www.espn.com/nfl/playbyplay?gameId=401220116","text":"Play-by-Play","shortText":"Play-by-Play","isExternal":false,"isPremium":false},{"language":"en-US","rel":["recap","desktop","event"],"href":"http://www.espn.com/nfl/recap?gameId=401220116","text":"Recap","shortText":"Recap","isExternal":false,"isPremium":false}],"status":{"clock":0.0,"displayClock":"0:00","period":4,"type":{"id":"3","name":"STATUS_FINAL","state":"post","completed":true,"description":"Final","detail":"Final","shortDetail":"Final"}}},{"id":"401220282","uid":"s:20~l:28~e:401220282","date":"2020-09-13T17:00Z","name":"Chicago Bears at Detroit Lions","shortName":"CHI @ DET","season":{"year":2020,"type":2},"competitions":[{"id":"401220282","uid":"s:20~l:28~e:401220282~c:401220282","date":"2020-09-13T17:00Z","attendance":0,"type":{"id":"1","abbreviation":"STD"},"timeValid":true,"neutralSite":false,"conferenceCompetition":false,"recent":true,"venue":{"id":"3727","fullName":"Ford Field","address":{"city":"Detroit","state":"MI"},"capacity":64500,"indoor":true},"competitors":[{"id":"8","uid":"s:20~l:28~t:8","type":"team","order":0,"homeAway":"home","winner":false,"team":{"id":"8","uid":"s:20~l:28~t:8","location":"Detroit","name":"Lions","abbreviation":"DET","displayName":"Detroit Lions","shortDisplayName":"Lions","color":"035C98","alternateColor":"b0b7bc","isActive":true,"venue":{"id":"3727"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/det/detroit-lions","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/det/detroit-lions","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/det/detroit-lions","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/det","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/det","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:8&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/det/detroit-lions","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/det","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/det","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/det","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/det.png"},"score":"23","linescores":[{"value":3.0},{"value":10.0},{"value":10.0},{"value":0.0}],"statistics":[],"records":[{"name":"YTD","abbreviation":"Game","type":"total","summary":"0-1"},{"name":"Home","type":"home","summary":"0-1"},{"name":"Road","type":"road","summary":"0-0"}]},{"id":"3","uid":"s:20~l:28~t:3","type":"team","order":1,"homeAway":"away","winner":true,"team":{"id":"3","uid":"s:20~l:28~t:3","location":"Chicago","name":"Bears","abbreviation":"CHI","displayName":"Chicago Bears","shortDisplayName":"Bears","color":"152644","alternateColor":"0b162a","isActive":true,"venue":{"id":"3933"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/chi/chicago-bears","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/chi/chicago-bears","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/chi/chicago-bears","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/chi","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/chi","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:3&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/chi/chicago-bears","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/chi","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/chi","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/chi","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/chi.png"},"score":"27","linescores":[{"value":3.0},{"value":3.0},{"value":0.0},{"value":21.0}],"statistics":[],"records":[{"name":"YTD","abbreviation":"Game","type":"total","summary":"1-0"},{"name":"Home","type":"home","summary":"0-0"},{"name":"Road","type":"road","summary":"1-0"}]}],"notes":[],"status":{"clock":0.0,"displayClock":"0:00","period":4,"type":{"id":"3","name":"STATUS_FINAL","state":"post","completed":true,"description":"Final","detail":"Final","shortDetail":"Final"}},"broadcasts":[{"market":"national","names":["FOX"]}],"leaders":[{"name":"passingYards","displayName":"Passing Leader","shortDisplayName":"PASS","abbreviation":"PYDS","leaders":[{"displayValue":"24-42, 297 YDS, 1 TD, 1 INT","value":297.0,"athlete":{"id":"12483","fullName":"Matthew Stafford","displayName":"Matthew Stafford","shortName":"M. Stafford","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/12483/matthew-stafford"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/12483/matthew-stafford"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/12483/matthew-stafford"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/12483/matthew-stafford"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/12483/matthew-stafford"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/12483/matthew-stafford"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/12483/matthew-stafford"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/12483.png","jersey":"9","position":{"abbreviation":"QB"},"team":{"id":"8"},"active":true},"team":{"id":"8"}}]},{"name":"rushingYards","displayName":"Rushing Leader","shortDisplayName":"RUSH","abbreviation":"RYDS","leaders":[{"displayValue":"14 CAR, 93 YDS","value":93.0,"athlete":{"id":"10452","fullName":"Adrian Peterson","displayName":"Adrian Peterson","shortName":"A. Peterson","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/10452/adrian-peterson"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/10452/adrian-peterson"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/10452/adrian-peterson"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/10452/adrian-peterson"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/10452/adrian-peterson"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/10452/adrian-peterson"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/10452/adrian-peterson"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/10452.png","jersey":"28","position":{"abbreviation":"RB"},"team":{"id":"8"},"active":true},"team":{"id":"8"}}]},{"name":"receivingYards","displayName":"Receiving Leader","shortDisplayName":"REC","abbreviation":"RECYDS","leaders":[{"displayValue":"5 REC, 81 YDS","value":81.0,"athlete":{"id":"11674","fullName":"Danny Amendola","displayName":"Danny Amendola","shortName":"D. Amendola","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/11674/danny-amendola"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/11674/danny-amendola"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/11674/danny-amendola"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/11674/danny-amendola"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/11674/danny-amendola"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/11674/danny-amendola"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/11674/danny-amendola"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/11674.png","jersey":"80","position":{"abbreviation":"WR"},"team":{"id":"8"},"active":true},"team":{"id":"8"}}]}],"startDate":"2020-09-13T17:00Z","geoBroadcasts":[{"type":{"id":"1","shortName":"TV"},"market":{"id":"1","type":"National"},"media":{"shortName":"FOX"},"lang":"en","region":"us"}]}],"links":[{"language":"en-US","rel":["summary","desktop","event"],"href":"http://www.espn.com/nfl/game/_/gameId/401220282","text":"Gamecast","shortText":"Gamecast","isExternal":false,"isPremium":false},{"language":"en-US","rel":["boxscore","desktop","event"],"href":"http://www.espn.com/nfl/boxscore?gameId=401220282","text":"Box Score","shortText":"Box Score","isExternal":false,"isPremium":false},{"language":"en-US","rel":["highlights","desktop"],"href":"http://www.espn.com/nfl/video?gameId=401220282","text":"Highlights","shortText":"Highlights","isExternal":false,"isPremium":false},{"language":"en-US","rel":["pbp","desktop","event"],"href":"http://www.espn.com/nfl/playbyplay?gameId=401220282","text":"Play-by-Play","shortText":"Play-by-Play","isExternal":false,"isPremium":false}],"status":{"clock":0.0,"displayClock":"0:00","period":4,"type":{"id":"3","name":"STATUS_FINAL","state":"post","completed":true,"description":"Final","detail":"Final","shortDetail":"Final"}}},{"id":"401220300","uid":"s:20~l:28~e:401220300","date":"2020-09-13T17:00Z","name":"Green Bay Packers at Minnesota Vikings","shortName":"GB @ MIN","season":{"year":2020,"type":2},"competitions":[{"id":"401220300","uid":"s:20~l:28~e:401220300~c:401220300","date":"2020-09-13T17:00Z","attendance":0,"type":{"id":"1","abbreviation":"STD"},"timeValid":true,"neutralSite":false,"conferenceCompetition":false,"recent":true,"venue":{"id":"5239","fullName":"U.S. Bank Stadium","address":{"city":"Minneapolis","state":"MN"},"capacity":66467,"indoor":true},"competitors":[{"id":"16","uid":"s:20~l:28~t:16","type":"team","order":0,"homeAway":"home","winner":false,"team":{"id":"16","uid":"s:20~l:28~t:16","location":"Minnesota","name":"Vikings","abbreviation":"MIN","displayName":"Minnesota Vikings","shortDisplayName":"Vikings","color":"240A67","alternateColor":"ffc62f","isActive":true,"venue":{"id":"5239"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/min/minnesota-vikings","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/min/minnesota-vikings","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/min/minnesota-vikings","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/min","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/min","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:16&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/min/minnesota-vikings","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/min","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/min","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/min","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/min.png"},"score":"34","linescores":[{"value":7.0},{"value":3.0},{"value":0.0},{"value":24.0}],"statistics":[],"records":[{"name":"YTD","abbreviation":"Game","type":"total","summary":"0-1"},{"name":"Home","type":"home","summary":"0-1"},{"name":"Road","type":"road","summary":"0-0"}]},{"id":"9","uid":"s:20~l:28~t:9","type":"team","order":1,"homeAway":"away","winner":true,"team":{"id":"9","uid":"s:20~l:28~t:9","location":"Green Bay","name":"Packers","abbreviation":"GB","displayName":"Green Bay Packers","shortDisplayName":"Packers","color":"204E32","alternateColor":"ffb612","isActive":true,"venue":{"id":"3798"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/gb/green-bay-packers","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/gb/green-bay-packers","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/gb/green-bay-packers","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/gb","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/gb","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:9&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/gb/green-bay-packers","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/gb","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/gb","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/gb","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/gb.png"},"score":"43","linescores":[{"value":3.0},{"value":19.0},{"value":7.0},{"value":14.0}],"statistics":[],"records":[{"name":"YTD","abbreviation":"Game","type":"total","summary":"1-0"},{"name":"Home","type":"home","summary":"0-0"},{"name":"Road","type":"road","summary":"1-0"}]}],"notes":[],"status":{"clock":0.0,"displayClock":"0:00","period":4,"type":{"id":"3","name":"STATUS_FINAL","state":"post","completed":true,"description":"Final","detail":"Final","shortDetail":"Final"}},"broadcasts":[{"market":"national","names":["FOX"]}],"leaders":[{"name":"passingYards","displayName":"Passing Leader","shortDisplayName":"PASS","abbreviation":"PYDS","leaders":[{"displayValue":"32-44, 364 YDS, 4 TD","value":364.0,"athlete":{"id":"8439","fullName":"Aaron Rodgers","displayName":"Aaron Rodgers","shortName":"A. Rodgers","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/8439/aaron-rodgers"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/8439/aaron-rodgers"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/8439/aaron-rodgers"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/8439/aaron-rodgers"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/8439/aaron-rodgers"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/8439/aaron-rodgers"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/8439/aaron-rodgers"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/8439.png","jersey":"12","position":{"abbreviation":"QB"},"team":{"id":"9"},"active":true},"team":{"id":"9"}}]},{"name":"rushingYards","displayName":"Rushing Leader","shortDisplayName":"RUSH","abbreviation":"RYDS","leaders":[{"displayValue":"16 CAR, 66 YDS, 1 TD","value":66.0,"athlete":{"id":"3042519","fullName":"Aaron Jones","displayName":"Aaron Jones","shortName":"A. Jones","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3042519/aaron-jones"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/3042519/aaron-jones"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/3042519/aaron-jones"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/3042519/aaron-jones"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/3042519/aaron-jones"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/3042519/aaron-jones"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3042519/aaron-jones"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/3042519.png","jersey":"33","position":{"abbreviation":"RB"},"team":{"id":"9"},"active":true},"team":{"id":"9"}}]},{"name":"receivingYards","displayName":"Receiving Leader","shortDisplayName":"REC","abbreviation":"RECYDS","leaders":[{"displayValue":"14 REC, 156 YDS, 2 TD","value":156.0,"athlete":{"id":"16800","fullName":"Davante Adams","displayName":"Davante Adams","shortName":"D. Adams","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/16800/davante-adams"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/16800/davante-adams"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/16800/davante-adams"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/16800/davante-adams"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/16800/davante-adams"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/16800/davante-adams"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/16800/davante-adams"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/16800.png","jersey":"17","position":{"abbreviation":"WR"},"team":{"id":"9"},"active":true},"team":{"id":"9"}}]}],"startDate":"2020-09-13T17:00Z","geoBroadcasts":[{"type":{"id":"1","shortName":"TV"},"market":{"id":"1","type":"National"},"media":{"shortName":"FOX"},"lang":"en","region":"us"},{"type":{"id":"5","shortName":"Radio"},"market":{"id":"1","type":"National"},"media":{"shortName":"ESPNRM"},"lang":"en","region":"us"}]}],"links":[{"language":"en-US","rel":["summary","desktop","event"],"href":"http://www.espn.com/nfl/game/_/gameId/401220300","text":"Gamecast","shortText":"Gamecast","isExternal":false,"isPremium":false},{"language":"en-US","rel":["boxscore","desktop","event"],"href":"http://www.espn.com/nfl/boxscore?gameId=401220300","text":"Box Score","shortText":"Box Score","isExternal":false,"isPremium":false},{"language":"en-US","rel":["highlights","desktop"],"href":"http://www.espn.com/nfl/video?gameId=401220300","text":"Highlights","shortText":"Highlights","isExternal":false,"isPremium":false},{"language":"en-US","rel":["pbp","desktop","event"],"href":"http://www.espn.com/nfl/playbyplay?gameId=401220300","text":"Play-by-Play","shortText":"Play-by-Play","isExternal":false,"isPremium":false}],"status":{"clock":0.0,"displayClock":"0:00","period":4,"type":{"id":"3","name":"STATUS_FINAL","state":"post","completed":true,"description":"Final","detail":"Final","shortDetail":"Final"}}},{"id":"401220131","uid":"s:20~l:28~e:401220131","date":"2020-09-13T17:00Z","name":"Miami Dolphins at New England Patriots","shortName":"MIA @ NE","season":{"year":2020,"type":2},"competitions":[{"id":"401220131","uid":"s:20~l:28~e:401220131~c:401220131","date":"2020-09-13T17:00Z","attendance":0,"type":{"id":"1","abbreviation":"STD"},"timeValid":true,"neutralSite":false,"conferenceCompetition":false,"recent":true,"venue":{"id":"3738","fullName":"Gillette Stadium","address":{"city":"Foxboro","state":"MA"},"capacity":65878,"indoor":false},"competitors":[{"id":"17","uid":"s:20~l:28~t:17","type":"team","order":0,"homeAway":"home","winner":true,"team":{"id":"17","uid":"s:20~l:28~t:17","location":"New England","name":"Patriots","abbreviation":"NE","displayName":"New England Patriots","shortDisplayName":"Patriots","color":"02244A","alternateColor":"b0b7bc","isActive":true,"venue":{"id":"3738"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/ne/new-england-patriots","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/ne/new-england-patriots","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/ne/new-england-patriots","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/ne","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/ne","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:17&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/ne/new-england-patriots","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/ne","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/ne","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/ne","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/ne.png"},"score":"21","linescores":[{"value":0.0},{"value":7.0},{"value":7.0},{"value":7.0}],"statistics":[],"records":[{"name":"YTD","abbreviation":"Game","type":"total","summary":"1-0"},{"name":"Home","type":"home","summary":"1-0"},{"name":"Road","type":"road","summary":"0-0"}]},{"id":"15","uid":"s:20~l:28~t:15","type":"team","order":1,"homeAway":"away","winner":false,"team":{"id":"15","uid":"s:20~l:28~t:15","location":"Miami","name":"Dolphins","abbreviation":"MIA","displayName":"Miami Dolphins","shortDisplayName":"Dolphins","color":"006B79","alternateColor":"005778","isActive":true,"venue":{"id":"3948"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/mia/miami-dolphins","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/mia/miami-dolphins","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/mia/miami-dolphins","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/mia","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/mia","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:15&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/mia/miami-dolphins","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/mia","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/mia","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/mia","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/mia.png"},"score":"11","linescores":[{"value":0.0},{"value":3.0},{"value":0.0},{"value":8.0}],"statistics":[],"records":[{"name":"YTD","abbreviation":"Game","type":"total","summary":"0-1"},{"name":"Home","type":"home","summary":"0-0"},{"name":"Road","type":"road","summary":"0-1"}]}],"notes":[],"status":{"clock":0.0,"displayClock":"0:00","period":4,"type":{"id":"3","name":"STATUS_FINAL","state":"post","completed":true,"description":"Final","detail":"Final","shortDetail":"Final"}},"broadcasts":[{"market":"national","names":["CBS"]}],"leaders":[{"name":"passingYards","displayName":"Passing Leader","shortDisplayName":"PASS","abbreviation":"PYDS","leaders":[{"displayValue":"20-30, 191 YDS, 3 INT","value":191.0,"athlete":{"id":"8664","fullName":"Ryan Fitzpatrick","displayName":"Ryan Fitzpatrick","shortName":"R. Fitzpatrick","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/8664/ryan-fitzpatrick"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/8664/ryan-fitzpatrick"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/8664/ryan-fitzpatrick"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/8664/ryan-fitzpatrick"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/8664/ryan-fitzpatrick"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/8664/ryan-fitzpatrick"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/8664/ryan-fitzpatrick"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/8664.png","jersey":"14","position":{"abbreviation":"QB"},"team":{"id":"15"},"active":true},"team":{"id":"15"}}]},{"name":"rushingYards","displayName":"Rushing Leader","shortDisplayName":"RUSH","abbreviation":"RYDS","leaders":[{"displayValue":"15 CAR, 75 YDS, 2 TD","value":75.0,"athlete":{"id":"13994","fullName":"Cam Newton","displayName":"Cam Newton","shortName":"C. Newton","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/13994/cam-newton"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/13994/cam-newton"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/13994/cam-newton"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/13994/cam-newton"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/13994/cam-newton"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/13994/cam-newton"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/13994/cam-newton"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/13994.png","jersey":"1","position":{"abbreviation":"QB"},"team":{"id":"17"},"active":true},"team":{"id":"17"}}]},{"name":"receivingYards","displayName":"Receiving Leader","shortDisplayName":"REC","abbreviation":"RECYDS","leaders":[{"displayValue":"5 REC, 57 YDS","value":57.0,"athlete":{"id":"12649","fullName":"Julian Edelman","displayName":"Julian Edelman","shortName":"J. Edelman","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/12649/julian-edelman"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/12649/julian-edelman"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/12649/julian-edelman"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/12649/julian-edelman"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/12649/julian-edelman"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/12649/julian-edelman"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/12649/julian-edelman"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/12649.png","jersey":"11","position":{"abbreviation":"WR"},"team":{"id":"17"},"active":true},"team":{"id":"17"}}]}],"startDate":"2020-09-13T17:00Z","geoBroadcasts":[{"type":{"id":"1","shortName":"TV"},"market":{"id":"1","type":"National"},"media":{"shortName":"CBS"},"lang":"en","region":"us"}],"headlines":[{"description":"Cam Newton looked just fine as Tom Bradys replacement, rushing for two touchdowns Sunday, and the New England Patriots beat the Miami Dolphins 21-11 to open the season.","type":"Recap","shortLinkText":"Newton runs for 2 TDs, Patriots hold off Dolphins 21-11","video":[{"id":29878371,"source":"espn","headline":"Cam rushes for two touchdowns in Patriots debut","thumbnail":"https://a.espncdn.com/media/motion/2020/0913/dm_200913_Cam_Newton_two_rushing_touchowns/dm_200913_Cam_Newton_two_rushing_touchowns.jpg","duration":47,"tracking":{"sportName":"nfl","leagueName":"No League","coverageType":"Final Game Highlight","trackingName":"*UNPUB 09/15* COM_NFL Highlight (Cam rushes for two touchdowns in Patriots debut) 2020/09/13 ESHEET SOTFULL","trackingId":"dm_200913_Cam_Newton_two_rushing_touchowns"},"deviceRestrictions":{"type":"whitelist","devices":["desktop","settop","handset","tablet"]},"geoRestrictions":{"type":"whitelist","countries":["HT","NA","GD","SR","LC","TT","CN","BZ","KY","GY","BS","GP","JM","MQ","FJ","MH","KE","NZ","US","AS","GU","MP","PR","VI","UM","BQ","BM","PW","ZM","KN","SX","VC","CD","AU","TZ","AI","LS","UG","VG","TC","FM","GB","UK","MW","AW","BW","GH","NG","RW","GF","MS","AG","ZW","BB"]},"links":{"api":{"self":{"href":"http://api.espn.com/v1/video/clips/29878371"},"artwork":{"href":"https://artwork.api.espn.com/artwork/collections/media/4700d4c4-929a-4ed2-8ca8-a290f59c3350"}},"web":{"href":"http://espn.go.com/video/clip?id=29878371&ex_cid=espnapi_internal","short":{"href":"https://es.pn/3mk8GAA"},"self":{"href":"http://espn.go.com/video/clip?id=29878371&ex_cid=espnapi_internal"}},"source":{"mezzanine":{"href":"https://media.video-origin.espn.com/espnvideo/2020/0913/dm_200913_Cam_Newton_two_rushing_touchowns/dm_200913_Cam_Newton_two_rushing_touchowns.mp4"},"flash":{"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_Cam_Newton_two_rushing_touchowns/dm_200913_Cam_Newton_two_rushing_touchowns.smil"},"hds":{"href":"https://hds.video-cdn.espn.com/z/motion/2020/0913/dm_200913_Cam_Newton_two_rushing_touchowns/dm_200913_Cam_Newton_two_rushing_touchowns_rel.smil/manifest.f4m"},"HLS":{"href":"https://espnpackaging-vh.akamaihd.net/i/motion/2020/0913/dm_200913_Cam_Newton_two_rushing_touchowns/dm_200913_Cam_Newton_two_rushing_touchowns.smil/master.m3u8","HD":{"href":"https://espnpackaging-vh.akamaihd.net/i/motion/2020/0913/dm_200913_Cam_Newton_two_rushing_touchowns/dm_200913_Cam_Newton_two_rushing_touchowns.smil/master.m3u8"}},"HD":{"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_Cam_Newton_two_rushing_touchowns/dm_200913_Cam_Newton_two_rushing_touchowns_720p30_2896k.mp4"},"full":{"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_Cam_Newton_two_rushing_touchowns/dm_200913_Cam_Newton_two_rushing_touchowns_360p30_1464k.mp4"},"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_Cam_Newton_two_rushing_touchowns/dm_200913_Cam_Newton_two_rushing_touchowns_360p30_1464k.mp4"},"mobile":{"alert":{"href":"http://m.espn.go.com/general/video/videoAlert?vid=29878371&ex_cid=espnapi_internal"},"source":{"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_Cam_Newton_two_rushing_touchowns/dm_200913_Cam_Newton_two_rushing_touchowns.mp4"},"href":"https://watch.auth.api.espn.com/video/auth/brightcove/4700d4c4-929a-4ed2-8ca8-a290f59c3350/asset?UMADPARAMreferer=http://espn.go.com/video/clip?id=29878371&ex_cid=espnapi_internal","streaming":{"href":"https://watch.auth.api.espn.com/video/auth/brightcove/4700d4c4-929a-4ed2-8ca8-a290f59c3350/asset?UMADPARAMreferer=http://espn.go.com/video/clip?id=29878371&ex_cid=espnapi_internal"},"progressiveDownload":{"href":"https://watch.auth.api.espn.com/video/auth/brightcove/4700d4c4-929a-4ed2-8ca8-a290f59c3350/asset?UMADPARAMreferer=http://espn.go.com/video/clip?id=29878371&ex_cid=espnapi_internal"}}}}]}]}],"links":[{"language":"en-US","rel":["summary","desktop","event"],"href":"http://www.espn.com/nfl/game/_/gameId/401220131","text":"Gamecast","shortText":"Gamecast","isExternal":false,"isPremium":false},{"language":"en-US","rel":["boxscore","desktop","event"],"href":"http://www.espn.com/nfl/boxscore?gameId=401220131","text":"Box Score","shortText":"Box Score","isExternal":false,"isPremium":false},{"language":"en-US","rel":["highlights","desktop"],"href":"http://www.espn.com/nfl/video?gameId=401220131","text":"Highlights","shortText":"Highlights","isExternal":false,"isPremium":false},{"language":"en-US","rel":["pbp","desktop","event"],"href":"http://www.espn.com/nfl/playbyplay?gameId=401220131","text":"Play-by-Play","shortText":"Play-by-Play","isExternal":false,"isPremium":false},{"language":"en-US","rel":["recap","desktop","event"],"href":"http://www.espn.com/nfl/recap?gameId=401220131","text":"Recap","shortText":"Recap","isExternal":false,"isPremium":false}],"status":{"clock":0.0,"displayClock":"0:00","period":4,"type":{"id":"3","name":"STATUS_FINAL","state":"post","completed":true,"description":"Final","detail":"Final","shortDetail":"Final"}}},{"id":"401220268","uid":"s:20~l:28~e:401220268","date":"2020-09-13T17:00Z","name":"Philadelphia Eagles at Washington ","shortName":"PHI @ WSH","season":{"year":2020,"type":2},"competitions":[{"id":"401220268","uid":"s:20~l:28~e:401220268~c:401220268","date":"2020-09-13T17:00Z","attendance":0,"type":{"id":"1","abbreviation":"STD"},"timeValid":true,"neutralSite":false,"conferenceCompetition":false,"recent":true,"venue":{"id":"3719","fullName":"FedExField","address":{"city":"Landover","state":"MD"},"capacity":82000,"indoor":false},"competitors":[{"id":"28","uid":"s:20~l:28~t:28","type":"team","order":0,"homeAway":"home","winner":true,"team":{"id":"28","uid":"s:20~l:28~t:28","location":"Washington","abbreviation":"WSH","displayName":"Washington","shortDisplayName":"Washington","color":"650415","alternateColor":"ffb612","isActive":true,"venue":{"id":"3719"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/wsh/washington","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/wsh/washington","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/wsh/washington","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/wsh","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/wsh","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:28&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/wsh/washington","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/wsh","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/wsh","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/wsh","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/wsh.png"},"score":"27","linescores":[{"value":0.0},{"value":7.0},{"value":7.0},{"value":13.0}],"statistics":[],"records":[{"name":"YTD","abbreviation":"Game","type":"total","summary":"1-0"},{"name":"Home","type":"home","summary":"1-0"},{"name":"Road","type":"road","summary":"0-0"}]},{"id":"21","uid":"s:20~l:28~t:21","type":"team","order":1,"homeAway":"away","winner":false,"team":{"id":"21","uid":"s:20~l:28~t:21","location":"Philadelphia","name":"Eagles","abbreviation":"PHI","displayName":"Philadelphia Eagles","shortDisplayName":"Eagles","color":"06424D","alternateColor":"a5acaf","isActive":true,"venue":{"id":"3806"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/phi/philadelphia-eagles","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/phi/philadelphia-eagles","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/phi/philadelphia-eagles","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/phi","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/phi","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:21&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/phi/philadelphia-eagles","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/phi","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/phi","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/phi","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/phi.png"},"score":"17","linescores":[{"value":10.0},{"value":7.0},{"value":0.0},{"value":0.0}],"statistics":[],"records":[{"name":"YTD","abbreviation":"Game","type":"total","summary":"0-1"},{"name":"Home","type":"home","summary":"0-0"},{"name":"Road","type":"road","summary":"0-1"}]}],"notes":[],"status":{"clock":0.0,"displayClock":"0:00","period":4,"type":{"id":"3","name":"STATUS_FINAL","state":"post","completed":true,"description":"Final","detail":"Final","shortDetail":"Final"}},"broadcasts":[{"market":"national","names":["FOX"]}],"leaders":[{"name":"passingYards","displayName":"Passing Leader","shortDisplayName":"PASS","abbreviation":"PYDS","leaders":[{"displayValue":"24-42, 270 YDS, 2 TD, 2 INT","value":270.0,"athlete":{"id":"2573079","fullName":"Carson Wentz","displayName":"Carson Wentz","shortName":"C. Wentz","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/2573079/carson-wentz"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/2573079/carson-wentz"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/2573079/carson-wentz"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/2573079/carson-wentz"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/2573079/carson-wentz"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/2573079/carson-wentz"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/2573079/carson-wentz"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/2573079.png","jersey":"11","position":{"abbreviation":"QB"},"team":{"id":"21"},"active":true},"team":{"id":"21"}}]},{"name":"rushingYards","displayName":"Rushing Leader","shortDisplayName":"RUSH","abbreviation":"RYDS","leaders":[{"displayValue":"9 CAR, 36 YDS","value":36.0,"athlete":{"id":"4360294","fullName":"Antonio Gibson","displayName":"Antonio Gibson","shortName":"A. Gibson","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/4360294/antonio-gibson"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/4360294/antonio-gibson"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/4360294/antonio-gibson"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/4360294/antonio-gibson"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/4360294/antonio-gibson"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/4360294/antonio-gibson"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/4360294/antonio-gibson"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/4360294.png","jersey":"24","position":{"abbreviation":"RB"},"team":{"id":"28"},"active":true},"team":{"id":"28"}}]},{"name":"receivingYards","displayName":"Receiving Leader","shortDisplayName":"REC","abbreviation":"RECYDS","leaders":[{"displayValue":"8 REC, 101 YDS, 1 TD","value":101.0,"athlete":{"id":"3121023","fullName":"Dallas Goedert","displayName":"Dallas Goedert","shortName":"D. Goedert","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3121023/dallas-goedert"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/3121023/dallas-goedert"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/3121023/dallas-goedert"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/3121023/dallas-goedert"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/3121023/dallas-goedert"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/3121023/dallas-goedert"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3121023/dallas-goedert"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/3121023.png","jersey":"88","position":{"abbreviation":"TE"},"team":{"id":"21"},"active":true},"team":{"id":"21"}}]}],"startDate":"2020-09-13T17:00Z","geoBroadcasts":[{"type":{"id":"1","shortName":"TV"},"market":{"id":"1","type":"National"},"media":{"shortName":"FOX"},"lang":"en","region":"us"}]}],"links":[{"language":"en-US","rel":["summary","desktop","event"],"href":"http://www.espn.com/nfl/game/_/gameId/401220268","text":"Gamecast","shortText":"Gamecast","isExternal":false,"isPremium":false},{"language":"en-US","rel":["boxscore","desktop","event"],"href":"http://www.espn.com/nfl/boxscore?gameId=401220268","text":"Box Score","shortText":"Box Score","isExternal":false,"isPremium":false},{"language":"en-US","rel":["highlights","desktop"],"href":"http://www.espn.com/nfl/video?gameId=401220268","text":"Highlights","shortText":"Highlights","isExternal":false,"isPremium":false},{"language":"en-US","rel":["pbp","desktop","event"],"href":"http://www.espn.com/nfl/playbyplay?gameId=401220268","text":"Play-by-Play","shortText":"Play-by-Play","isExternal":false,"isPremium":false},{"language":"en-US","rel":["recap","desktop","event"],"href":"http://www.espn.com/nfl/recap?gameId=401220268","text":"Recap","shortText":"Recap","isExternal":false,"isPremium":false}],"status":{"clock":0.0,"displayClock":"0:00","period":4,"type":{"id":"3","name":"STATUS_FINAL","state":"post","completed":true,"description":"Final","detail":"Final","shortDetail":"Final"}}},{"id":"401220370","uid":"s:20~l:28~e:401220370","date":"2020-09-13T17:00Z","name":"Las Vegas Raiders at Carolina Panthers","shortName":"LV @ CAR","season":{"year":2020,"type":2},"competitions":[{"id":"401220370","uid":"s:20~l:28~e:401220370~c:401220370","date":"2020-09-13T17:00Z","attendance":0,"type":{"id":"1","abbreviation":"STD"},"timeValid":true,"neutralSite":false,"conferenceCompetition":false,"recent":true,"venue":{"id":"3628","fullName":"Bank of America Stadium","address":{"city":"Charlotte","state":"NC"},"capacity":73778,"indoor":false},"competitors":[{"id":"29","uid":"s:20~l:28~t:29","type":"team","order":0,"homeAway":"home","winner":false,"team":{"id":"29","uid":"s:20~l:28~t:29","location":"Carolina","name":"Panthers","abbreviation":"CAR","displayName":"Carolina Panthers","shortDisplayName":"Panthers","color":"2177B0","alternateColor":"bfc0bf","isActive":true,"venue":{"id":"3628"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/car/carolina-panthers","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/car/carolina-panthers","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/car/carolina-panthers","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/car","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/car","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:29&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/car/carolina-panthers","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/car","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/car","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/car","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/car.png"},"score":"30","linescores":[{"value":9.0},{"value":6.0},{"value":0.0},{"value":15.0}],"statistics":[],"records":[{"name":"YTD","abbreviation":"Game","type":"total","summary":"0-1"},{"name":"Home","type":"home","summary":"0-1"},{"name":"Road","type":"road","summary":"0-0"}]},{"id":"13","uid":"s:20~l:28~t:13","type":"team","order":1,"homeAway":"away","winner":true,"team":{"id":"13","uid":"s:20~l:28~t:13","location":"Las Vegas","name":"Raiders","abbreviation":"LV","displayName":"Las Vegas Raiders","shortDisplayName":"Raiders","color":"000000","alternateColor":"a5acaf","isActive":true,"venue":{"id":"6501"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/lv/las-vegas-raiders","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/lv/las-vegas-raiders","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/lv/las-vegas-raiders","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/lv","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/lv","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:13&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/lv/las-vegas-raiders","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/lv","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/lv","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/lv","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/lv.png"},"score":"34","linescores":[{"value":7.0},{"value":10.0},{"value":10.0},{"value":7.0}],"statistics":[],"records":[{"name":"YTD","abbreviation":"Game","type":"total","summary":"1-0"},{"name":"Home","type":"home","summary":"0-0"},{"name":"Road","type":"road","summary":"1-0"}]}],"notes":[],"status":{"clock":0.0,"displayClock":"0:00","period":4,"type":{"id":"3","name":"STATUS_FINAL","state":"post","completed":true,"description":"Final","detail":"Final","shortDetail":"Final"}},"broadcasts":[{"market":"national","names":["CBS"]}],"leaders":[{"name":"passingYards","displayName":"Passing Leader","shortDisplayName":"PASS","abbreviation":"PYDS","leaders":[{"displayValue":"22-34, 270 YDS, 1 TD","value":270.0,"athlete":{"id":"16728","fullName":"Teddy Bridgewater","displayName":"Teddy Bridgewater","shortName":"T. Bridgewater","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/16728/teddy-bridgewater"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/16728/teddy-bridgewater"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/16728/teddy-bridgewater"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/16728/teddy-bridgewater"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/16728/teddy-bridgewater"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/16728/teddy-bridgewater"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/16728/teddy-bridgewater"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/16728.png","jersey":"5","position":{"abbreviation":"QB"},"team":{"id":"29"},"active":true},"team":{"id":"29"}}]},{"name":"rushingYards","displayName":"Rushing Leader","shortDisplayName":"RUSH","abbreviation":"RYDS","leaders":[{"displayValue":"23 CAR, 96 YDS, 2 TD","value":96.0,"athlete":{"id":"3117251","fullName":"Christian McCaffrey","displayName":"Christian McCaffrey","shortName":"C. McCaffrey","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3117251/christian-mccaffrey"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/3117251/christian-mccaffrey"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/3117251/christian-mccaffrey"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/3117251/christian-mccaffrey"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/3117251/christian-mccaffrey"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/3117251/christian-mccaffrey"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3117251/christian-mccaffrey"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/3117251.png","jersey":"22","position":{"abbreviation":"RB"},"team":{"id":"29"},"active":true},"team":{"id":"29"}}]},{"name":"receivingYards","displayName":"Receiving Leader","shortDisplayName":"REC","abbreviation":"RECYDS","leaders":[{"displayValue":"6 REC, 115 YDS, 1 TD","value":115.0,"athlete":{"id":"2574808","fullName":"Robby Anderson","displayName":"Robby Anderson","shortName":"R. Anderson","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/2574808/robby-anderson"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/2574808/robby-anderson"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/2574808/robby-anderson"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/2574808/robby-anderson"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/2574808/robby-anderson"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/2574808/robby-anderson"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/2574808/robby-anderson"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/2574808.png","jersey":"11","position":{"abbreviation":"WR"},"team":{"id":"29"},"active":true},"team":{"id":"29"}}]}],"startDate":"2020-09-13T17:00Z","geoBroadcasts":[{"type":{"id":"1","shortName":"TV"},"market":{"id":"1","type":"National"},"media":{"shortName":"CBS"},"lang":"en","region":"us"}],"headlines":[{"description":"Josh Jacobs ran for 93 yards and three touchdowns, Derek Carr threw for 239 yards and a score and the Las Vegas Raiders hung on to beat the Carolina Panthers 34-30 on Sunday to spoil Matt Rhules coaching debut.","type":"Recap","shortLinkText":"Jacobs runs for 3 TDs as Raiders hold off Panthers 34-30","video":[{"id":29878005,"source":"espn","headline":"Agholor hauls in beautiful pass from Carr for TD","thumbnail":"https://a.espncdn.com/media/motion/2020/0913/dm_200913_nfl_raiders_agholor_td/dm_200913_nfl_raiders_agholor_td.jpg","duration":19,"tracking":{"sportName":"nfl","leagueName":"No League","coverageType":"Final Game Highlight","trackingName":"*UNPUB 9/15* NFL_One-Play (Agholor hauls in beautiful pass from Carr for TD) 2020/9/13 ESHEET","trackingId":"dm_200913_nfl_raiders_agholor_td"},"deviceRestrictions":{"type":"whitelist","devices":["desktop","settop","handset","tablet"]},"geoRestrictions":{"type":"whitelist","countries":["HT","NA","GD","SR","LC","TT","CN","BZ","KY","GY","BS","GP","JM","MQ","FJ","MH","KE","NZ","US","AS","GU","MP","PR","VI","UM","BQ","BM","PW","ZM","KN","SX","VC","CD","AU","TZ","AI","LS","UG","VG","TC","FM","GB","UK","MW","AW","BW","GH","NG","RW","GF","MS","AG","ZW","BB"]},"links":{"api":{"self":{"href":"http://api.espn.com/v1/video/clips/29878005"},"artwork":{"href":"https://artwork.api.espn.com/artwork/collections/media/c6badbbe-5ba5-4e8f-b146-9ff7b2ca8ff0"}},"web":{"href":"http://espn.go.com/video/clip?id=29878005&ex_cid=espnapi_internal","short":{"href":"https://es.pn/3meTLrs"},"self":{"href":"http://espn.go.com/video/clip?id=29878005&ex_cid=espnapi_internal"}},"source":{"mezzanine":{"href":"https://media.video-origin.espn.com/espnvideo/2020/0913/dm_200913_nfl_raiders_agholor_td/dm_200913_nfl_raiders_agholor_td.mp4"},"flash":{"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_nfl_raiders_agholor_td/dm_200913_nfl_raiders_agholor_td.smil"},"hds":{"href":"https://hds.video-cdn.espn.com/z/motion/2020/0913/dm_200913_nfl_raiders_agholor_td/dm_200913_nfl_raiders_agholor_td_rel.smil/manifest.f4m"},"HLS":{"href":"https://espnpackaging-vh.akamaihd.net/i/motion/2020/0913/dm_200913_nfl_raiders_agholor_td/dm_200913_nfl_raiders_agholor_td.smil/master.m3u8","HD":{"href":"https://espnpackaging-vh.akamaihd.net/i/motion/2020/0913/dm_200913_nfl_raiders_agholor_td/dm_200913_nfl_raiders_agholor_td.smil/master.m3u8"}},"HD":{"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_nfl_raiders_agholor_td/dm_200913_nfl_raiders_agholor_td_720p30_2896k.mp4"},"full":{"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_nfl_raiders_agholor_td/dm_200913_nfl_raiders_agholor_td_360p30_1464k.mp4"},"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_nfl_raiders_agholor_td/dm_200913_nfl_raiders_agholor_td_360p30_1464k.mp4"},"mobile":{"alert":{"href":"http://m.espn.go.com/general/video/videoAlert?vid=29878005&ex_cid=espnapi_internal"},"source":{"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_nfl_raiders_agholor_td/dm_200913_nfl_raiders_agholor_td.mp4"},"href":"https://watch.auth.api.espn.com/video/auth/brightcove/c6badbbe-5ba5-4e8f-b146-9ff7b2ca8ff0/asset?UMADPARAMreferer=http://espn.go.com/video/clip?id=29878005&ex_cid=espnapi_internal","streaming":{"href":"https://watch.auth.api.espn.com/video/auth/brightcove/c6badbbe-5ba5-4e8f-b146-9ff7b2ca8ff0/asset?UMADPARAMreferer=http://espn.go.com/video/clip?id=29878005&ex_cid=espnapi_internal"},"progressiveDownload":{"href":"https://watch.auth.api.espn.com/video/auth/brightcove/c6badbbe-5ba5-4e8f-b146-9ff7b2ca8ff0/asset?UMADPARAMreferer=http://espn.go.com/video/clip?id=29878005&ex_cid=espnapi_internal"}}}}]}]}],"links":[{"language":"en-US","rel":["summary","desktop","event"],"href":"http://www.espn.com/nfl/game/_/gameId/401220370","text":"Gamecast","shortText":"Gamecast","isExternal":false,"isPremium":false},{"language":"en-US","rel":["boxscore","desktop","event"],"href":"http://www.espn.com/nfl/boxscore?gameId=401220370","text":"Box Score","shortText":"Box Score","isExternal":false,"isPremium":false},{"language":"en-US","rel":["highlights","desktop"],"href":"http://www.espn.com/nfl/video?gameId=401220370","text":"Highlights","shortText":"Highlights","isExternal":false,"isPremium":false},{"language":"en-US","rel":["pbp","desktop","event"],"href":"http://www.espn.com/nfl/playbyplay?gameId=401220370","text":"Play-by-Play","shortText":"Play-by-Play","isExternal":false,"isPremium":false},{"language":"en-US","rel":["recap","desktop","event"],"href":"http://www.espn.com/nfl/recap?gameId=401220370","text":"Recap","shortText":"Recap","isExternal":false,"isPremium":false}],"status":{"clock":0.0,"displayClock":"0:00","period":4,"type":{"id":"3","name":"STATUS_FINAL","state":"post","completed":true,"description":"Final","detail":"Final","shortDetail":"Final"}}},{"id":"401220195","uid":"s:20~l:28~e:401220195","date":"2020-09-13T17:00Z","name":"Indianapolis Colts at Jacksonville Jaguars","shortName":"IND @ JAX","season":{"year":2020,"type":2},"competitions":[{"id":"401220195","uid":"s:20~l:28~e:401220195~c:401220195","date":"2020-09-13T17:00Z","attendance":14100,"type":{"id":"1","abbreviation":"STD"},"timeValid":true,"neutralSite":false,"conferenceCompetition":false,"recent":true,"venue":{"id":"3712","fullName":"TIAA Bank Field","address":{"city":"Jacksonville","state":"FL"},"capacity":67858,"indoor":false},"competitors":[{"id":"30","uid":"s:20~l:28~t:30","type":"team","order":0,"homeAway":"home","winner":true,"team":{"id":"30","uid":"s:20~l:28~t:30","location":"Jacksonville","name":"Jaguars","abbreviation":"JAX","displayName":"Jacksonville Jaguars","shortDisplayName":"Jaguars","color":"00839C","alternateColor":"000000","isActive":true,"venue":{"id":"3712"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/jax/jacksonville-jaguars","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/jax/jacksonville-jaguars","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/jax/jacksonville-jaguars","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/jax","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/jax","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:30&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/jax/jacksonville-jaguars","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/jax","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/jax","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/jax","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/jax.png"},"score":"27","linescores":[{"value":0.0},{"value":14.0},{"value":3.0},{"value":10.0}],"statistics":[],"records":[{"name":"YTD","abbreviation":"Game","type":"total","summary":"1-0"},{"name":"Home","type":"home","summary":"1-0"},{"name":"Road","type":"road","summary":"0-0"}]},{"id":"11","uid":"s:20~l:28~t:11","type":"team","order":1,"homeAway":"away","winner":false,"team":{"id":"11","uid":"s:20~l:28~t:11","location":"Indianapolis","name":"Colts","abbreviation":"IND","displayName":"Indianapolis Colts","shortDisplayName":"Colts","color":"00417E","alternateColor":"ffffff","isActive":true,"venue":{"id":"3812"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/ind/indianapolis-colts","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/ind/indianapolis-colts","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/ind/indianapolis-colts","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/ind","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/ind","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:11&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/ind/indianapolis-colts","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/ind","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/ind","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/ind","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/ind.png"},"score":"20","linescores":[{"value":7.0},{"value":10.0},{"value":0.0},{"value":3.0}],"statistics":[],"records":[{"name":"YTD","abbreviation":"Game","type":"total","summary":"0-1"},{"name":"Home","type":"home","summary":"0-0"},{"name":"Road","type":"road","summary":"0-1"}]}],"notes":[],"status":{"clock":0.0,"displayClock":"0:00","period":4,"type":{"id":"3","name":"STATUS_FINAL","state":"post","completed":true,"description":"Final","detail":"Final","shortDetail":"Final"}},"broadcasts":[{"market":"national","names":["CBS"]}],"leaders":[{"name":"passingYards","displayName":"Passing Leader","shortDisplayName":"PASS","abbreviation":"PYDS","leaders":[{"displayValue":"36-46, 363 YDS, 1 TD, 2 INT","value":363.0,"athlete":{"id":"5529","fullName":"Philip Rivers","displayName":"Philip Rivers","shortName":"P. Rivers","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/5529/philip-rivers"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/5529/philip-rivers"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/5529/philip-rivers"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/5529/philip-rivers"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/5529/philip-rivers"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/5529/philip-rivers"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/5529/philip-rivers"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/5529.png","jersey":"17","position":{"abbreviation":"QB"},"team":{"id":"11"},"active":true},"team":{"id":"11"}}]},{"name":"rushingYards","displayName":"Rushing Leader","shortDisplayName":"RUSH","abbreviation":"RYDS","leaders":[{"displayValue":"16 CAR, 62 YDS","value":62.0,"athlete":{"id":"4052042","fullName":"James Robinson","displayName":"James Robinson","shortName":"J. Robinson","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/4052042/james-robinson"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/4052042/james-robinson"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/4052042/james-robinson"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/4052042/james-robinson"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/4052042/james-robinson"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/4052042/james-robinson"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/4052042/james-robinson"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/4052042.png","jersey":"30","position":{"abbreviation":"RB"},"team":{"id":"30"},"active":true},"team":{"id":"30"}}]},{"name":"receivingYards","displayName":"Receiving Leader","shortDisplayName":"REC","abbreviation":"RECYDS","leaders":[{"displayValue":"6 REC, 71 YDS","value":71.0,"athlete":{"id":"3121410","fullName":"Parris Campbell","displayName":"Parris Campbell","shortName":"P. Campbell","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3121410/parris-campbell"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/3121410/parris-campbell"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/3121410/parris-campbell"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/3121410/parris-campbell"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/3121410/parris-campbell"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/3121410/parris-campbell"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3121410/parris-campbell"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/3121410.png","jersey":"15","position":{"abbreviation":"WR"},"team":{"id":"11"},"active":true},"team":{"id":"11"}}]}],"startDate":"2020-09-13T17:00Z","geoBroadcasts":[{"type":{"id":"1","shortName":"TV"},"market":{"id":"1","type":"National"},"media":{"shortName":"CBS"},"lang":"en","region":"us"}],"headlines":[{"description":"Minshew Mania is back and maybe better than before.","type":"Recap","shortLinkText":"Minshew Mania 2.0: Jaguars stun Colts 27-20 in season opener","video":[{"id":29878659,"source":"espn","headline":"Minshew tosses three TDs in win over Colts","thumbnail":"https://a.espncdn.com/media/motion/2020/0913/dm_200913_Minshew_SOT_vs_Colts/dm_200913_Minshew_SOT_vs_Colts.jpg","duration":55,"tracking":{"sportName":"nfl","leagueName":"No League","coverageType":"Final Game Highlight","trackingName":"*UNPUB 9/15* COM_NFL Highlight (Minshew tosses three TDs in win over Colts) 2020/9/13 ESHEET SOTFULL","trackingId":"dm_200913_Minshew_SOT_vs_Colts"},"deviceRestrictions":{"type":"whitelist","devices":["desktop","settop","handset","tablet"]},"geoRestrictions":{"type":"whitelist","countries":["HT","NA","GD","SR","LC","TT","CN","BZ","KY","GY","BS","GP","JM","MQ","FJ","MH","KE","NZ","US","AS","GU","MP","PR","VI","UM","BQ","BM","PW","ZM","KN","SX","VC","CD","AU","TZ","AI","LS","UG","VG","TC","FM","GB","UK","MW","AW","BW","GH","NG","RW","GF","MS","AG","ZW","BB"]},"links":{"api":{"self":{"href":"http://api.espn.com/v1/video/clips/29878659"},"artwork":{"href":"https://artwork.api.espn.com/artwork/collections/media/6a905b3d-20da-4f60-93c7-d841ec307e6f"}},"web":{"href":"http://espn.go.com/video/clip?id=29878659&ex_cid=espnapi_internal","short":{"href":"https://es.pn/3kbap9y"},"self":{"href":"http://espn.go.com/video/clip?id=29878659&ex_cid=espnapi_internal"}},"source":{"mezzanine":{"href":"https://media.video-origin.espn.com/espnvideo/2020/0913/dm_200913_Minshew_SOT_vs_Colts/dm_200913_Minshew_SOT_vs_Colts.mp4"},"flash":{"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_Minshew_SOT_vs_Colts/dm_200913_Minshew_SOT_vs_Colts.smil"},"hds":{"href":"https://hds.video-cdn.espn.com/z/motion/2020/0913/dm_200913_Minshew_SOT_vs_Colts/dm_200913_Minshew_SOT_vs_Colts_rel.smil/manifest.f4m"},"HLS":{"href":"https://espnpackaging-vh.akamaihd.net/i/motion/2020/0913/dm_200913_Minshew_SOT_vs_Colts/dm_200913_Minshew_SOT_vs_Colts.smil/master.m3u8","HD":{"href":"https://espnpackaging-vh.akamaihd.net/i/motion/2020/0913/dm_200913_Minshew_SOT_vs_Colts/dm_200913_Minshew_SOT_vs_Colts.smil/master.m3u8"}},"HD":{"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_Minshew_SOT_vs_Colts/dm_200913_Minshew_SOT_vs_Colts_720p30_2896k.mp4"},"full":{"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_Minshew_SOT_vs_Colts/dm_200913_Minshew_SOT_vs_Colts_360p30_1464k.mp4"},"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_Minshew_SOT_vs_Colts/dm_200913_Minshew_SOT_vs_Colts_360p30_1464k.mp4"},"mobile":{"alert":{"href":"http://m.espn.go.com/general/video/videoAlert?vid=29878659&ex_cid=espnapi_internal"},"source":{"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_Minshew_SOT_vs_Colts/dm_200913_Minshew_SOT_vs_Colts.mp4"},"href":"https://watch.auth.api.espn.com/video/auth/brightcove/6a905b3d-20da-4f60-93c7-d841ec307e6f/asset?UMADPARAMreferer=http://espn.go.com/video/clip?id=29878659&ex_cid=espnapi_internal","streaming":{"href":"https://watch.auth.api.espn.com/video/auth/brightcove/6a905b3d-20da-4f60-93c7-d841ec307e6f/asset?UMADPARAMreferer=http://espn.go.com/video/clip?id=29878659&ex_cid=espnapi_internal"},"progressiveDownload":{"href":"https://watch.auth.api.espn.com/video/auth/brightcove/6a905b3d-20da-4f60-93c7-d841ec307e6f/asset?UMADPARAMreferer=http://espn.go.com/video/clip?id=29878659&ex_cid=espnapi_internal"}}}}]}]}],"links":[{"language":"en-US","rel":["summary","desktop","event"],"href":"http://www.espn.com/nfl/game/_/gameId/401220195","text":"Gamecast","shortText":"Gamecast","isExternal":false,"isPremium":false},{"language":"en-US","rel":["boxscore","desktop","event"],"href":"http://www.espn.com/nfl/boxscore?gameId=401220195","text":"Box Score","shortText":"Box Score","isExternal":false,"isPremium":false},{"language":"en-US","rel":["highlights","desktop"],"href":"http://www.espn.com/nfl/video?gameId=401220195","text":"Highlights","shortText":"Highlights","isExternal":false,"isPremium":false},{"language":"en-US","rel":["pbp","desktop","event"],"href":"http://www.espn.com/nfl/playbyplay?gameId=401220195","text":"Play-by-Play","shortText":"Play-by-Play","isExternal":false,"isPremium":false},{"language":"en-US","rel":["recap","desktop","event"],"href":"http://www.espn.com/nfl/recap?gameId=401220195","text":"Recap","shortText":"Recap","isExternal":false,"isPremium":false}],"status":{"clock":0.0,"displayClock":"0:00","period":4,"type":{"id":"3","name":"STATUS_FINAL","state":"post","completed":true,"description":"Final","detail":"Final","shortDetail":"Final"}}},{"id":"401220147","uid":"s:20~l:28~e:401220147","date":"2020-09-13T17:00Z","name":"Cleveland Browns at Baltimore Ravens","shortName":"CLE @ BAL","season":{"year":2020,"type":2},"competitions":[{"id":"401220147","uid":"s:20~l:28~e:401220147~c:401220147","date":"2020-09-13T17:00Z","attendance":0,"type":{"id":"1","abbreviation":"STD"},"timeValid":true,"neutralSite":false,"conferenceCompetition":false,"recent":true,"venue":{"id":"3814","fullName":"M&T Bank Stadium","address":{"city":"Baltimore","state":"MD"},"capacity":71008,"indoor":false},"competitors":[{"id":"33","uid":"s:20~l:28~t:33","type":"team","order":0,"homeAway":"home","winner":true,"team":{"id":"33","uid":"s:20~l:28~t:33","location":"Baltimore","name":"Ravens","abbreviation":"BAL","displayName":"Baltimore Ravens","shortDisplayName":"Ravens","color":"2B025B","alternateColor":"9e7c0c","isActive":true,"venue":{"id":"3814"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/bal/baltimore-ravens","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/bal/baltimore-ravens","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/bal/baltimore-ravens","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/bal","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/bal","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:33&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/bal/baltimore-ravens","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/bal","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/bal","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/bal","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/bal.png"},"score":"38","linescores":[{"value":10.0},{"value":14.0},{"value":7.0},{"value":7.0}],"statistics":[],"records":[{"name":"YTD","abbreviation":"Game","type":"total","summary":"1-0"},{"name":"Home","type":"home","summary":"1-0"},{"name":"Road","type":"road","summary":"0-0"}]},{"id":"5","uid":"s:20~l:28~t:5","type":"team","order":1,"homeAway":"away","winner":false,"team":{"id":"5","uid":"s:20~l:28~t:5","location":"Cleveland","name":"Browns","abbreviation":"CLE","displayName":"Cleveland Browns","shortDisplayName":"Browns","color":"4C230E","alternateColor":"4c230e","isActive":true,"venue":{"id":"3679"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/cle/cleveland-browns","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/cle/cleveland-browns","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/cle/cleveland-browns","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/cle","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/cle","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:5&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/cle/cleveland-browns","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/cle","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/cle","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/cle","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/cle.png"},"score":"6","linescores":[{"value":6.0},{"value":0.0},{"value":0.0},{"value":0.0}],"statistics":[],"records":[{"name":"YTD","abbreviation":"Game","type":"total","summary":"0-1"},{"name":"Home","type":"home","summary":"0-0"},{"name":"Road","type":"road","summary":"0-1"}]}],"notes":[],"status":{"clock":0.0,"displayClock":"0:00","period":4,"type":{"id":"3","name":"STATUS_FINAL","state":"post","completed":true,"description":"Final","detail":"Final","shortDetail":"Final"}},"broadcasts":[{"market":"national","names":["CBS"]}],"leaders":[{"name":"passingYards","displayName":"Passing Leader","shortDisplayName":"PASS","abbreviation":"PYDS","leaders":[{"displayValue":"20-25, 275 YDS, 3 TD","value":275.0,"athlete":{"id":"3916387","fullName":"Lamar Jackson","displayName":"Lamar Jackson","shortName":"L. Jackson","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3916387/lamar-jackson"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/3916387/lamar-jackson"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/3916387/lamar-jackson"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/3916387/lamar-jackson"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/3916387/lamar-jackson"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/3916387/lamar-jackson"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3916387/lamar-jackson"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/3916387.png","jersey":"8","position":{"abbreviation":"QB"},"team":{"id":"33"},"active":true},"team":{"id":"33"}}]},{"name":"rushingYards","displayName":"Rushing Leader","shortDisplayName":"RUSH","abbreviation":"RYDS","leaders":[{"displayValue":"13 CAR, 72 YDS","value":72.0,"athlete":{"id":"3059915","fullName":"Kareem Hunt","displayName":"Kareem Hunt","shortName":"K. Hunt","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3059915/kareem-hunt"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/3059915/kareem-hunt"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/3059915/kareem-hunt"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/3059915/kareem-hunt"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/3059915/kareem-hunt"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/3059915/kareem-hunt"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3059915/kareem-hunt"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/3059915.png","jersey":"27","position":{"abbreviation":"RB"},"team":{"id":"5"},"active":true},"team":{"id":"5"}}]},{"name":"receivingYards","displayName":"Receiving Leader","shortDisplayName":"REC","abbreviation":"RECYDS","leaders":[{"displayValue":"5 REC, 101 YDS","value":101.0,"athlete":{"id":"4241372","fullName":"Marquise Brown","displayName":"Marquise Brown","shortName":"M. Brown","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/4241372/marquise-brown"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/4241372/marquise-brown"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/4241372/marquise-brown"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/4241372/marquise-brown"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/4241372/marquise-brown"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/4241372/marquise-brown"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/4241372/marquise-brown"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/4241372.png","jersey":"15","position":{"abbreviation":"WR"},"team":{"id":"33"},"active":true},"team":{"id":"33"}}]}],"startDate":"2020-09-13T17:00Z","geoBroadcasts":[{"type":{"id":"1","shortName":"TV"},"market":{"id":"1","type":"National"},"media":{"shortName":"CBS"},"lang":"en","region":"us"}],"headlines":[{"description":"Looking every bit like the reigning NFL MVP, Lamar Jackson threw for 275 yards and three touchdowns to help the Baltimore Ravens beat the Browns 38-6 Sunday, ruining Kevin Stefanskis debut as Clevelands head coach in a game played without fans in...","type":"Recap","shortLinkText":"Jackson throws 3 TD passes for Ravens in 38-6 rout of Browns","video":[{"id":29878553,"source":"espn","headline":"Lamar Jackson in MVP form with 3 TDs in season opener","thumbnail":"https://a.espncdn.com/media/motion/2020/0913/dm_200913_LAMAR_JACKSON_WEED_1_SOTFULL/dm_200913_LAMAR_JACKSON_WEED_1_SOTFULL.jpg","duration":37,"tracking":{"sportName":"nfl","leagueName":"No League","coverageType":"Final Game Highlight","trackingName":"*UNPUB 9/15* COM_NFL Highlight (Lamar Jackson in MVP form with 3 TDs in season opener) 2020/9/13 ESHEET SOTFULL","trackingId":"dm_200913_LAMAR_JACKSON_WEED_1_SOTFULL"},"deviceRestrictions":{"type":"whitelist","devices":["desktop","settop","handset","tablet"]},"geoRestrictions":{"type":"whitelist","countries":["HT","NA","GD","SR","LC","TT","CN","BZ","KY","GY","BS","GP","JM","MQ","FJ","MH","KE","NZ","US","AS","GU","MP","PR","VI","UM","BQ","BM","PW","ZM","KN","SX","VC","CD","AU","TZ","AI","LS","UG","VG","TC","FM","GB","UK","MW","AW","BW","GH","NG","RW","GF","MS","AG","ZW","BB"]},"links":{"api":{"self":{"href":"http://api.espn.com/v1/video/clips/29878553"},"artwork":{"href":"https://artwork.api.espn.com/artwork/collections/media/600015a5-9e23-4e69-afe3-319b1cae78ec"}},"web":{"href":"http://espn.go.com/video/clip?id=29878553&ex_cid=espnapi_internal","short":{"href":"https://es.pn/33n2Dmc"},"self":{"href":"http://espn.go.com/video/clip?id=29878553&ex_cid=espnapi_internal"}},"source":{"mezzanine":{"href":"https://media.video-origin.espn.com/espnvideo/2020/0913/dm_200913_LAMAR_JACKSON_WEED_1_SOTFULL/dm_200913_LAMAR_JACKSON_WEED_1_SOTFULL.mp4"},"flash":{"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_LAMAR_JACKSON_WEED_1_SOTFULL/dm_200913_LAMAR_JACKSON_WEED_1_SOTFULL.smil"},"hds":{"href":"https://hds.video-cdn.espn.com/z/motion/2020/0913/dm_200913_LAMAR_JACKSON_WEED_1_SOTFULL/dm_200913_LAMAR_JACKSON_WEED_1_SOTFULL_rel.smil/manifest.f4m"},"HLS":{"href":"https://espnpackaging-vh.akamaihd.net/i/motion/2020/0913/dm_200913_LAMAR_JACKSON_WEED_1_SOTFULL/dm_200913_LAMAR_JACKSON_WEED_1_SOTFULL.smil/master.m3u8","HD":{"href":"https://espnpackaging-vh.akamaihd.net/i/motion/2020/0913/dm_200913_LAMAR_JACKSON_WEED_1_SOTFULL/dm_200913_LAMAR_JACKSON_WEED_1_SOTFULL.smil/master.m3u8"}},"HD":{"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_LAMAR_JACKSON_WEED_1_SOTFULL/dm_200913_LAMAR_JACKSON_WEED_1_SOTFULL_720p30_2896k.mp4"},"full":{"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_LAMAR_JACKSON_WEED_1_SOTFULL/dm_200913_LAMAR_JACKSON_WEED_1_SOTFULL_360p30_1464k.mp4"},"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_LAMAR_JACKSON_WEED_1_SOTFULL/dm_200913_LAMAR_JACKSON_WEED_1_SOTFULL_360p30_1464k.mp4"},"mobile":{"alert":{"href":"http://m.espn.go.com/general/video/videoAlert?vid=29878553&ex_cid=espnapi_internal"},"source":{"href":"https://media.video-cdn.espn.com/motion/2020/0913/dm_200913_LAMAR_JACKSON_WEED_1_SOTFULL/dm_200913_LAMAR_JACKSON_WEED_1_SOTFULL.mp4"},"href":"https://watch.auth.api.espn.com/video/auth/brightcove/600015a5-9e23-4e69-afe3-319b1cae78ec/asset?UMADPARAMreferer=http://espn.go.com/video/clip?id=29878553&ex_cid=espnapi_internal","streaming":{"href":"https://watch.auth.api.espn.com/video/auth/brightcove/600015a5-9e23-4e69-afe3-319b1cae78ec/asset?UMADPARAMreferer=http://espn.go.com/video/clip?id=29878553&ex_cid=espnapi_internal"},"progressiveDownload":{"href":"https://watch.auth.api.espn.com/video/auth/brightcove/600015a5-9e23-4e69-afe3-319b1cae78ec/asset?UMADPARAMreferer=http://espn.go.com/video/clip?id=29878553&ex_cid=espnapi_internal"}}}}]}]}],"links":[{"language":"en-US","rel":["summary","desktop","event"],"href":"http://www.espn.com/nfl/game/_/gameId/401220147","text":"Gamecast","shortText":"Gamecast","isExternal":false,"isPremium":false},{"language":"en-US","rel":["boxscore","desktop","event"],"href":"http://www.espn.com/nfl/boxscore?gameId=401220147","text":"Box Score","shortText":"Box Score","isExternal":false,"isPremium":false},{"language":"en-US","rel":["highlights","desktop"],"href":"http://www.espn.com/nfl/video?gameId=401220147","text":"Highlights","shortText":"Highlights","isExternal":false,"isPremium":false},{"language":"en-US","rel":["pbp","desktop","event"],"href":"http://www.espn.com/nfl/playbyplay?gameId=401220147","text":"Play-by-Play","shortText":"Play-by-Play","isExternal":false,"isPremium":false},{"language":"en-US","rel":["recap","desktop","event"],"href":"http://www.espn.com/nfl/recap?gameId=401220147","text":"Recap","shortText":"Recap","isExternal":false,"isPremium":false}],"status":{"clock":0.0,"displayClock":"0:00","period":4,"type":{"id":"3","name":"STATUS_FINAL","state":"post","completed":true,"description":"Final","detail":"Final","shortDetail":"Final"}}},{"id":"401220347","uid":"s:20~l:28~e:401220347","date":"2020-09-14T00:20Z","name":"Dallas Cowboys at Los Angeles Rams","shortName":"DAL @ LAR","season":{"year":2020,"type":2},"competitions":[{"id":"401220347","uid":"s:20~l:28~e:401220347~c:401220347","date":"2020-09-14T00:20Z","attendance":0,"type":{"id":"1","abbreviation":"STD"},"timeValid":true,"neutralSite":false,"conferenceCompetition":false,"recent":false,"venue":{"id":"7065","fullName":"SoFi Stadium","address":{"city":"Inglewood","state":"CA"},"capacity":70240,"indoor":true},"competitors":[{"id":"14","uid":"s:20~l:28~t:14","type":"team","order":0,"homeAway":"home","team":{"id":"14","uid":"s:20~l:28~t:14","location":"Los Angeles","name":"Rams","abbreviation":"LAR","displayName":"Los Angeles Rams","shortDisplayName":"Rams","color":"00295B","alternateColor":"b3995d","isActive":true,"venue":{"id":"477"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/lar/los-angeles-rams","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/lar/los-angeles-rams","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/lar/los-angeles-rams","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/lar","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/lar","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:14&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/lar/los-angeles-rams","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/lar","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/lar","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/lar","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/lar.png"},"score":"0","statistics":[],"records":[{"name":"All Splits","abbreviation":"Any","type":"total","summary":"0-0"},{"name":"Home","type":"home","summary":"0-0"},{"name":"Road","type":"road","summary":"0-0"}]},{"id":"6","uid":"s:20~l:28~t:6","type":"team","order":1,"homeAway":"away","team":{"id":"6","uid":"s:20~l:28~t:6","location":"Dallas","name":"Cowboys","abbreviation":"DAL","displayName":"Dallas Cowboys","shortDisplayName":"Cowboys","color":"002E4D","alternateColor":"b0b7bc","isActive":true,"venue":{"id":"3687"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/dal/dallas-cowboys","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/dal/dallas-cowboys","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/dal/dallas-cowboys","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/dal","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/dal","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:6&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/dal/dallas-cowboys","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/dal","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/dal","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/dal","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/dal.png"},"score":"0","statistics":[],"records":[{"name":"All Splits","abbreviation":"Any","type":"total","summary":"0-0"},{"name":"Home","type":"home","summary":"0-0"},{"name":"Road","type":"road","summary":"0-0"}]}],"notes":[],"status":{"clock":0.0,"displayClock":"0:00","period":0,"type":{"id":"1","name":"STATUS_SCHEDULED","state":"pre","completed":false,"description":"Scheduled","detail":"Sun, September 13th at 8:20 PM EDT","shortDetail":"9/13 - 8:20 PM EDT"}},"broadcasts":[{"market":"national","names":["NBC"]}],"tickets":[{"summary":"Tickets as low as $277","numberAvailable":1752,"links":[{"href":"https://www.vividseats.com/nfl/los-angeles-rams-tickets/rams-3-13-3460489.html?wsUser=717"},{"href":"https://www.vividseats.com/venues/sofi-stadium-tickets.html?wsUser=717"}]}],"startDate":"2020-09-14T00:20Z","geoBroadcasts":[{"type":{"id":"1","shortName":"TV"},"market":{"id":"1","type":"National"},"media":{"shortName":"NBC"},"lang":"en","region":"us"}],"odds":[{"provider":{"id":"38","name":"Caesars","priority":1},"details":"DAL -1.0","overUnder":51.5}]}],"links":[{"language":"en-US","rel":["summary","desktop","event"],"href":"http://www.espn.com/nfl/game/_/gameId/401220347","text":"Gamecast","shortText":"Gamecast","isExternal":false,"isPremium":false}],"status":{"clock":0.0,"displayClock":"0:00","period":0,"type":{"id":"1","name":"STATUS_SCHEDULED","state":"pre","completed":false,"description":"Scheduled","detail":"Sun, September 13th at 8:20 PM EDT","shortDetail":"9/13 - 8:20 PM EDT"}}},{"id":"401220225","uid":"s:20~l:28~e:401220225","date":"2020-09-11T00:20Z","name":"Houston Texans at Kansas City Chiefs","shortName":"HOU @ KC","season":{"year":2020,"type":2},"competitions":[{"id":"401220225","uid":"s:20~l:28~e:401220225~c:401220225","date":"2020-09-11T00:20Z","attendance":15895,"type":{"id":"1","abbreviation":"STD"},"timeValid":true,"neutralSite":false,"conferenceCompetition":false,"recent":false,"venue":{"id":"3622","fullName":"Arrowhead Stadium","address":{"city":"Kansas City","state":"MO"},"capacity":76416,"indoor":false},"competitors":[{"id":"12","uid":"s:20~l:28~t:12","type":"team","order":0,"homeAway":"home","winner":true,"team":{"id":"12","uid":"s:20~l:28~t:12","location":"Kansas City","name":"Chiefs","abbreviation":"KC","displayName":"Kansas City Chiefs","shortDisplayName":"Chiefs","color":"BE1415","alternateColor":"e31837","isActive":true,"venue":{"id":"3622"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/kc/kansas-city-chiefs","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/kc/kansas-city-chiefs","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/kc/kansas-city-chiefs","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/kc","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/kc","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:12&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/kc/kansas-city-chiefs","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/kc","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/kc","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/kc","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/kc.png"},"score":"34","linescores":[{"value":0.0},{"value":17.0},{"value":7.0},{"value":10.0}],"statistics":[],"records":[{"name":"YTD","abbreviation":"Game","type":"total","summary":"1-0"},{"name":"Home","type":"home","summary":"1-0"},{"name":"Road","type":"road","summary":"0-0"}]},{"id":"34","uid":"s:20~l:28~t:34","type":"team","order":1,"homeAway":"away","winner":false,"team":{"id":"34","uid":"s:20~l:28~t:34","location":"Houston","name":"Texans","abbreviation":"HOU","displayName":"Houston Texans","shortDisplayName":"Texans","color":"00133F","alternateColor":"a71930","isActive":true,"venue":{"id":"3891"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/hou/houston-texans","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/hou/houston-texans","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/hou/houston-texans","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/hou","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/hou","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:34&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/hou/houston-texans","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/hou","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/hou","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/hou","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/hou.png"},"score":"20","linescores":[{"value":7.0},{"value":0.0},{"value":0.0},{"value":13.0}],"statistics":[],"records":[{"name":"YTD","abbreviation":"Game","type":"total","summary":"0-1"},{"name":"Home","type":"home","summary":"0-0"},{"name":"Road","type":"road","summary":"0-1"}]}],"notes":[],"status":{"clock":0.0,"displayClock":"0:00","period":4,"type":{"id":"3","name":"STATUS_FINAL","state":"post","completed":true,"description":"Final","detail":"Final","shortDetail":"Final"}},"broadcasts":[{"market":"national","names":["NBC"]}],"leaders":[{"name":"passingYards","displayName":"Passing Leader","shortDisplayName":"PASS","abbreviation":"PYDS","leaders":[{"displayValue":"20-32, 253 YDS, 1 TD, 1 INT","value":253.0,"athlete":{"id":"3122840","fullName":"Deshaun Watson","displayName":"Deshaun Watson","shortName":"D. Watson","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3122840/deshaun-watson"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/3122840/deshaun-watson"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/3122840/deshaun-watson"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/3122840/deshaun-watson"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/3122840/deshaun-watson"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/3122840/deshaun-watson"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3122840/deshaun-watson"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/3122840.png","jersey":"4","position":{"abbreviation":"QB"},"team":{"id":"34"},"active":true},"team":{"id":"34"}}]},{"name":"rushingYards","displayName":"Rushing Leader","shortDisplayName":"RUSH","abbreviation":"RYDS","leaders":[{"displayValue":"25 CAR, 138 YDS, 1 TD","value":138.0,"athlete":{"id":"4242214","fullName":"Clyde Edwards-Helaire","displayName":"Clyde Edwards-Helaire","shortName":"C. Edwards-Helaire","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/4242214/clyde-edwards-helaire"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/4242214/clyde-edwards-helaire"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/4242214/clyde-edwards-helaire"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/4242214/clyde-edwards-helaire"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/4242214/clyde-edwards-helaire"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/4242214/clyde-edwards-helaire"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/4242214/clyde-edwards-helaire"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/4242214.png","jersey":"25","position":{"abbreviation":"RB"},"team":{"id":"12"},"active":true},"team":{"id":"12"}}]},{"name":"receivingYards","displayName":"Receiving Leader","shortDisplayName":"REC","abbreviation":"RECYDS","leaders":[{"displayValue":"8 REC, 112 YDS","value":112.0,"athlete":{"id":"3052876","fullName":"Will Fuller V","displayName":"Will Fuller V","shortName":"W. Fuller V","links":[{"rel":["playercard","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3052876/will-fuller-v"},{"rel":["stats","desktop","athlete"],"href":"http://www.espn.com/nfl/player/stats/_/id/3052876/will-fuller-v"},{"rel":["splits","desktop","athlete"],"href":"http://www.espn.com/nfl/player/splits/_/id/3052876/will-fuller-v"},{"rel":["gamelog","desktop","athlete"],"href":"http://www.espn.com/nfl/player/gamelog/_/id/3052876/will-fuller-v"},{"rel":["news","desktop","athlete"],"href":"http://www.espn.com/nfl/player/news/_/id/3052876/will-fuller-v"},{"rel":["bio","desktop","athlete"],"href":"http://www.espn.com/nfl/player/bio/_/id/3052876/will-fuller-v"},{"rel":["overview","desktop","athlete"],"href":"http://www.espn.com/nfl/player/_/id/3052876/will-fuller-v"}],"headshot":"https://a.espncdn.com/i/headshots/nfl/players/full/3052876.png","jersey":"15","position":{"abbreviation":"WR"},"team":{"id":"34"},"active":true},"team":{"id":"34"}}]}],"startDate":"2020-09-11T00:20Z","geoBroadcasts":[{"type":{"id":"1","shortName":"TV"},"market":{"id":"1","type":"National"},"media":{"shortName":"NBC"},"lang":"en","region":"us"}],"headlines":[{"description":"Just about the only thing that looked familiar about the NFLs long-awaited return Thursday night was the sight of Patrick Mahomes effortlessly leading the Kansas City Chiefs up and down the field.","type":"Recap","shortLinkText":"Chiefs begin title defense with 34-20 victory over Texans"}]}],"links":[{"language":"en-US","rel":["summary","desktop","event"],"href":"http://www.espn.com/nfl/game/_/gameId/401220225","text":"Gamecast","shortText":"Gamecast","isExternal":false,"isPremium":false},{"language":"en-US","rel":["boxscore","desktop","event"],"href":"http://www.espn.com/nfl/boxscore?gameId=401220225","text":"Box Score","shortText":"Box Score","isExternal":false,"isPremium":false},{"language":"en-US","rel":["pbp","desktop","event"],"href":"http://www.espn.com/nfl/playbyplay?gameId=401220225","text":"Play-by-Play","shortText":"Play-by-Play","isExternal":false,"isPremium":false},{"language":"en-US","rel":["recap","desktop","event"],"href":"http://www.espn.com/nfl/recap?gameId=401220225","text":"Recap","shortText":"Recap","isExternal":false,"isPremium":false}],"status":{"clock":0.0,"displayClock":"0:00","period":4,"type":{"id":"3","name":"STATUS_FINAL","state":"post","completed":true,"description":"Final","detail":"Final","shortDetail":"Final"}}},{"id":"401220256","uid":"s:20~l:28~e:401220256","date":"2020-09-14T23:15Z","name":"Pittsburgh Steelers at New York Giants","shortName":"PIT @ NYG","season":{"year":2020,"type":2},"competitions":[{"id":"401220256","uid":"s:20~l:28~e:401220256~c:401220256","date":"2020-09-14T23:15Z","attendance":0,"type":{"id":"1","abbreviation":"STD"},"timeValid":true,"neutralSite":false,"conferenceCompetition":false,"recent":false,"venue":{"id":"3839","fullName":"MetLife Stadium","address":{"city":"East Rutherford","state":"NJ"},"capacity":82500,"indoor":false},"competitors":[{"id":"19","uid":"s:20~l:28~t:19","type":"team","order":0,"homeAway":"home","team":{"id":"19","uid":"s:20~l:28~t:19","location":"New York","name":"Giants","abbreviation":"NYG","displayName":"New York Giants","shortDisplayName":"Giants","color":"052570","alternateColor":"ffffff","isActive":true,"venue":{"id":"3839"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/nyg/new-york-giants","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/nyg/new-york-giants","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/nyg/new-york-giants","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/nyg","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/nyg","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:19&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/nyg/new-york-giants","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/nyg","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/nyg","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/nyg","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/nyg.png"},"score":"0","statistics":[],"records":[{"name":"All Splits","abbreviation":"Any","type":"total","summary":"0-0"},{"name":"Home","type":"home","summary":"0-0"},{"name":"Road","type":"road","summary":"0-0"}]},{"id":"23","uid":"s:20~l:28~t:23","type":"team","order":1,"homeAway":"away","team":{"id":"23","uid":"s:20~l:28~t:23","location":"Pittsburgh","name":"Steelers","abbreviation":"PIT","displayName":"Pittsburgh Steelers","shortDisplayName":"Steelers","color":"000000","alternateColor":"ffb612","isActive":true,"venue":{"id":"3752"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/pit/pittsburgh-steelers","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/pit/pittsburgh-steelers","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/pit/pittsburgh-steelers","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/pit","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/pit","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:23&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/pit/pittsburgh-steelers","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/pit","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/pit","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/pit","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/pit.png"},"score":"0","statistics":[],"records":[{"name":"All Splits","abbreviation":"Any","type":"total","summary":"0-0"},{"name":"Home","type":"home","summary":"0-0"},{"name":"Road","type":"road","summary":"0-0"}]}],"notes":[],"status":{"clock":0.0,"displayClock":"0:00","period":0,"type":{"id":"1","name":"STATUS_SCHEDULED","state":"pre","completed":false,"description":"Scheduled","detail":"Mon, September 14th at 7:15 PM EDT","shortDetail":"9/14 - 7:15 PM EDT"}},"broadcasts":[{"market":"national","names":["ESPN"]}],"tickets":[{"summary":"Tickets as low as $98","numberAvailable":1776,"links":[{"href":"https://www.vividseats.com/nfl/new-york-giants-tickets/giants-3-15-3460193.html?wsUser=717"},{"href":"https://www.vividseats.com/venues/metlife-stadium-tickets.html?wsUser=717"}]}],"startDate":"2020-09-14T23:15Z","geoBroadcasts":[{"type":{"id":"1","shortName":"TV"},"market":{"id":"1","type":"National"},"media":{"shortName":"ESPN"},"lang":"en","region":"us"}],"odds":[{"provider":{"id":"38","name":"Caesars","priority":1},"details":"PIT -5.5","overUnder":45.5}]}],"links":[{"language":"en-US","rel":["summary","desktop","event"],"href":"http://www.espn.com/nfl/game/_/gameId/401220256","text":"Gamecast","shortText":"Gamecast","isExternal":false,"isPremium":false}],"status":{"clock":0.0,"displayClock":"0:00","period":0,"type":{"id":"1","name":"STATUS_SCHEDULED","state":"pre","completed":false,"description":"Scheduled","detail":"Mon, September 14th at 7:15 PM EDT","shortDetail":"9/14 - 7:15 PM EDT"}}},{"id":"401220217","uid":"s:20~l:28~e:401220217","date":"2020-09-15T02:10Z","name":"Tennessee Titans at Denver Broncos","shortName":"TEN @ DEN","season":{"year":2020,"type":2},"competitions":[{"id":"401220217","uid":"s:20~l:28~e:401220217~c:401220217","date":"2020-09-15T02:10Z","attendance":0,"type":{"id":"1","abbreviation":"STD"},"timeValid":true,"neutralSite":false,"conferenceCompetition":false,"recent":false,"venue":{"id":"3937","fullName":"Empower Field at Mile High","address":{"city":"Denver","state":"CO"},"capacity":76125,"indoor":false},"competitors":[{"id":"7","uid":"s:20~l:28~t:7","type":"team","order":0,"homeAway":"home","team":{"id":"7","uid":"s:20~l:28~t:7","location":"Denver","name":"Broncos","abbreviation":"DEN","displayName":"Denver Broncos","shortDisplayName":"Broncos","color":"002E4D","alternateColor":"fb4f14","isActive":true,"venue":{"id":"3937"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/den/denver-broncos","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/den/denver-broncos","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/den/denver-broncos","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/den","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/den","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:7&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/den/denver-broncos","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/den","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/den","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/den","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/den.png"},"score":"0","statistics":[],"records":[{"name":"All Splits","abbreviation":"Any","type":"total","summary":"0-0"},{"name":"Home","type":"home","summary":"0-0"},{"name":"Road","type":"road","summary":"0-0"}]},{"id":"10","uid":"s:20~l:28~t:10","type":"team","order":1,"homeAway":"away","team":{"id":"10","uid":"s:20~l:28~t:10","location":"Tennessee","name":"Titans","abbreviation":"TEN","displayName":"Tennessee Titans","shortDisplayName":"Titans","color":"2F95DD","alternateColor":"4b92db","isActive":true,"venue":{"id":"3810"},"links":[{"rel":["clubhouse","desktop","team"],"href":"http://www.espn.com/nfl/team/_/name/ten/tennessee-titans","text":"Clubhouse","isExternal":false,"isPremium":false},{"rel":["roster","desktop","team"],"href":"http://www.espn.com/nfl/team/roster/_/name/ten/tennessee-titans","text":"Roster","isExternal":false,"isPremium":false},{"rel":["stats","desktop","team"],"href":"http://www.espn.com/nfl/team/stats/_/name/ten/tennessee-titans","text":"Statistics","isExternal":false,"isPremium":false},{"rel":["schedule","desktop","team"],"href":"http://www.espn.com/nfl/team/schedule/_/name/ten","text":"Schedule","isExternal":false,"isPremium":false},{"rel":["photos","desktop","team"],"href":"http://www.espn.com/nfl/team/photos/_/name/ten","text":"photos","isExternal":false,"isPremium":false},{"rel":["scores","sportscenter","app","team"],"href":"sportscenter://x-callback-url/showClubhouse?uid=s:20~l:28~t:10&section=scores","text":"Scores","isExternal":false,"isPremium":false},{"rel":["draftpicks","desktop","team"],"href":"http://www.espn.com/nfl/draft/teams/_/name/ten/tennessee-titans","text":"Draft Picks","isExternal":false,"isPremium":true},{"rel":["transactions","desktop","team"],"href":"http://www.espn.com/nfl/team/transactions/_/name/ten","text":"Transactions","isExternal":false,"isPremium":false},{"rel":["injuries","desktop","team"],"href":"http://www.espn.com/nfl/team/injuries/_/name/ten","text":"Injuries","isExternal":false,"isPremium":false},{"rel":["depthchart","desktop","team"],"href":"http://www.espn.com/nfl/team/depth/_/name/ten","text":"Depth Chart","isExternal":false,"isPremium":false}],"logo":"https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/ten.png"},"score":"0","statistics":[],"records":[{"name":"All Splits","abbreviation":"Any","type":"total","summary":"0-0"},{"name":"Home","type":"home","summary":"0-0"},{"name":"Road","type":"road","summary":"0-0"}]}],"notes":[],"status":{"clock":0.0,"displayClock":"0:00","period":0,"type":{"id":"1","name":"STATUS_SCHEDULED","state":"pre","completed":false,"description":"Scheduled","detail":"Mon, September 14th at 10:10 PM EDT","shortDetail":"9/14 - 10:10 PM EDT"}},"broadcasts":[{"market":"national","names":["ESPN"]}],"tickets":[{"summary":"Tickets as low as $110","numberAvailable":506,"links":[{"href":"https://www.vividseats.com/nfl/denver-broncos-tickets/broncos-3-8-3460445.html?wsUser=717"},{"href":"https://www.vividseats.com/venues/broncos-stadium-at-mile-high-tickets.html?wsUser=717"}]}],"startDate":"2020-09-15T02:10Z","geoBroadcasts":[{"type":{"id":"1","shortName":"TV"},"market":{"id":"1","type":"National"},"media":{"shortName":"ESPN"},"lang":"en","region":"us"}],"odds":[{"provider":{"id":"38","name":"Caesars","priority":1},"details":"TEN -3.0","overUnder":41.5}]}],"links":[{"language":"en-US","rel":["summary","desktop","event"],"href":"http://www.espn.com/nfl/game/_/gameId/401220217","text":"Gamecast","shortText":"Gamecast","isExternal":false,"isPremium":false}],"status":{"clock":0.0,"displayClock":"0:00","period":0,"type":{"id":"1","name":"STATUS_SCHEDULED","state":"pre","completed":false,"description":"Scheduled","detail":"Mon, September 14th at 10:10 PM EDT","shortDetail":"9/14 - 10:10 PM EDT"}}}]};');
   d.writeln('   //nfl_scores = JSON.stringify(nfl_scores);');
   d.writeln('   //process_nfl_scores(document,display_dialog,command,nfl_scores);return;');//JLJL
   d.writeln('');
   d.writeln('');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (window.top.gv.get_scores_state == "on") user_message += "  \\"Auto Refresh\\" will be stopped."');
   d.writeln('');
   d.writeln('   // Get the NFL scores from the internet.');
   d.writeln('');
   d.writeln('   nfl_connection = new XMLHttpRequest();');
   d.writeln('');
   d.writeln('   nfl_connection.open("GET",request_url,true);');
   d.writeln('');
   d.writeln('   nfl_connection.onload = function(e)');
   d.writeln('   {');
   d.writeln('      if (nfl_connection.readyState === 4) // Is XMLHttpRequest complete?');
   d.writeln('      {');
   d.writeln('         if (nfl_connection.status === 200) // Was the XMLHttpRequest successful?');
   d.writeln('         {');
   d.writeln('            nfl_scores = nfl_connection.responseText;');
   d.writeln('');
   d.writeln('            process_nfl_scores(document,display_dialog,command,nfl_scores);')
   d.writeln('         }')
   d.writeln('         else // XMLHttpRequest was unsuccessful.')
   d.writeln('         {')
   d.writeln('            alert(user_message);');
   d.writeln('');
   d.writeln('            // Force Auto Refresh to be off and refresh the preliminary form.');
   d.writeln('');
   d.writeln('            get_scores_auto_refresh(document,"stop");');
   d.writeln('');
   d.writeln('            document.location.href="fp_regular_season_form.html";');
   d.writeln('         }')
   d.writeln('      }')
   d.writeln('');
   d.writeln('      return;');
   d.writeln('   }')
   d.writeln('');
   d.writeln('   nfl_connection.onerror = function(e)')
   d.writeln('   {')
   d.writeln('      alert(user_message);');
   d.writeln('');
   d.writeln('      // Force Auto Refresh to be off and refresh the preliminary form.');
   d.writeln('');
   d.writeln('      get_scores_auto_refresh(document,"stop");');
   d.writeln('');
   d.writeln('      document.location.href="fp_regular_season_form.html";');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   };')
   d.writeln('')
   d.writeln('   nfl_connection.send(null);')
   d.writeln('');
   d.writeln('   return;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function get_scores_auto_refresh(document,command)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   clear_get_scores_data();');
   d.writeln('');
   d.writeln('   if (command == "start")');
   d.writeln('   {');
   d.writeln('      if (window.top.gv.get_scores_state == "off")');
   d.writeln('      {');
   d.writeln('         window.top.gv.get_scores_state = "on";');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('   else  // command must equal "stop".');
   d.writeln('   {;');
   d.writeln('      if (window.top.gv.get_scores_state == "on")');
   d.writeln('      {');
   d.writeln('         clearInterval(window.top.gv.get_scores_timer);');
   d.writeln('');
   d.writeln('         window.top.gv.get_scores_state = "off";');
   d.writeln('         window.top.gv.get_scores_timer = null;');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function get_selected_opponent(document)');
   d.writeln('{');
   d.writeln('   var opponent_menu            = document.fp_results.opponent_name_menu;');
   d.writeln('   var opponent_index           = opponent_menu.selectedIndex;');
   d.writeln('   window.top.gv.opponent_index = opponent_menu.options[opponent_index].value;');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function get_selected_player(document)');
   d.writeln('{');
   d.writeln('   var player_menu            = document.fp_results.player_name_menu;');
   d.writeln('   var player_index           = player_menu.selectedIndex;');
   d.writeln('   window.top.gv.player_index = player_menu.options[player_index].value;');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function get_selected_winners(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   var results        = document.fp_results;');
   d.writeln('   var winner_index   = 0;');
   d.writeln('   var winners_select = 0;');
   d.writeln('');
   d.writeln('');
   d.writeln('   for (var i = 0; i < '+number_of_rs_games+'; i++)');
   d.writeln('   {');
   d.writeln('      for (var j = 0; j < results.elements.length; j++)');
   d.writeln('      {');
   d.writeln('         if (results.elements[j].name == "winner"+(i+1))');
   d.writeln('         {');
   d.writeln('            winners_select                  = results.elements[j];');
   d.writeln('            winners_index                   = winners_select.selectedIndex;');
   d.writeln('            window.top.gv.prelim_winners[i] = winners_select.options[winners_index].value;');
   d.writeln('         }');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function process_nfl_scores(document,display_dialog,command,nfl_scores)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   clear_get_scores_data();');
   d.writeln('');
   d.writeln('   window.top.gv.refresh_scores = true;');
   d.writeln('');
   d.writeln('   var down                        = "";');
   d.writeln('       var game                        = "";');
   d.writeln('       var game_clock_integer          = "";');
   d.writeln('       var game_clock_string           = "";');
   d.writeln('       var game_list                   = "";');
   d.writeln('       var game_state                  = "";');
   d.writeln('       var game_status                 = "game_not_started";');
   d.writeln('       var game_valid                  = false;');
   d.writeln('       var games_in_progress           = false;');
   d.writeln('       var home_score                  = "";');
   d.writeln('       var home_team                   = "";');
   d.writeln('       var home_team_id                = "";');
   d.writeln('       var home_teams                  = "";');
   d.writeln('       //var nfl_team_city_abbreviations = ["ARI",      "ATL",    "BAL",   "BUF",  "CAR",     "CHI",  "CIN",    "CLE",   "DAL",    "DEN",    "DET",  "GB",     "HOU",   "IND",  "JAC",    "KC",    "LA",  "LAC",     "MIA",     "MIN",    "NE",      "NO",    "NYG",   "NYJ", "LV",     "PHI",   "PIT",     "SEA",     "SF",   "TB",        "TEN",   "WSH"          ];');
   d.writeln('       var nfl_team_names              = ["Cardinals","Falcons","Ravens","Bills","Panthers","Bears","Bengals","Browns","Cowboys","Broncos","Lions","Packers","Texans","Colts","Jaguars","Chiefs","Rams","Chargers","Dolphins","Vikings","Patriots","Saints","Giants","Jets","Raiders","Eagles","Steelers","Seahawks","49ers","Buccaneers","Titans","Football Team"];');
   d.writeln('       var number_of_rs_games          = '+number_of_rs_games+';');
   d.writeln('       var possession_team             = 0;');
   d.writeln('       var possession_teams_index      = 0;');
   d.writeln('   var prelim_victors_index        = 0;');
   d.writeln('   var temp_string                 = "";');
   d.writeln('       var user_message                = "";');
   d.writeln('       var visiting_score              = "";');
   d.writeln('       var visiting_team               = "";');
   d.writeln('       var visiting_team_id            = "";');
   d.writeln('       var visiting_teams              = "";');
   d.writeln('   var week                        = window.top.gv.current_input_week-1;');
   d.writeln('   var winning_teams_index         = 0;');
   d.writeln('   var winning_teams               = Array(number_of_rs_games).fill("");');
   d.writeln('');
   d.writeln('');
   d.writeln('   if (command != "Start")');
   d.writeln('   {');
   d.writeln('      command = "Get NFL Scores";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (display_dialog == true)');
   d.writeln('   {');
   d.writeln('      user_message = "\\""+ command + "\\" will:\\n\\n";');
   d.writeln('      user_message = user_message + "   - Clear the winners on the Preliminary Form\\n";');
   d.writeln('      user_message = user_message + "   - Get all in-progress and final scores from the internet\\n";');
   d.writeln('      user_message = user_message + "   - Populate the Preliminary Form using the scores from the internet";');
   d.writeln('      if (command == "Start")');
   d.writeln('      {');
   d.writeln('         user_message = user_message + "\\n   - Automatically update the Preliminary Form every 10 seconds\\n";');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      if (confirm(user_message) == false) return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   home_teams     = window.top.gv.all_home_teams[week-1];');
   d.writeln('   visiting_teams = window.top.gv.all_visiting_teams[week-1];');
   d.writeln('');
   d.writeln('   // Convert nfl_scores string to a JavaScript object.');
   d.writeln('');
   d.writeln('   nfl_scores = JSON.parse(nfl_scores);');
   d.writeln('');
   d.writeln('   // Get the game list pointer from nfl_scores.');
   d.writeln('');
   d.writeln('   game_list = nfl_scores.events;');
   d.writeln('');
   d.writeln('   // Loop through the game list and get information for each valid game.');
   d.writeln('');
   d.writeln('   for (var i = 0; i < game_list.length; i++)');
   d.writeln('   {');
   d.writeln('      // Get the game pointer game_list.');
   d.writeln('');
   d.writeln('      game = game_list[i].competitions[0];');
   d.writeln('');
   d.writeln('      // Get the team names and scores.');
   d.writeln('');
   d.writeln('      if (game.competitors[0].homeAway == "home")');
   d.writeln('      {');
   d.writeln('         home_team    = game.competitors[0].team.name;');
   d.writeln('         home_team_id = game.competitors[0].id;');
   d.writeln('         home_score   = game.competitors[0].score;');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      if (game.competitors[1].homeAway == "home")');
   d.writeln('      {');
   d.writeln('         home_team    = game.competitors[1].team.name;');
   d.writeln('         home_team_id = game.competitors[1].id;');
   d.writeln('         home_score   = game.competitors[1].score;');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      if (game.competitors[0].homeAway == "away")');
   d.writeln('      {');
   d.writeln('         visiting_team    = game.competitors[0].team.name;');
   d.writeln('         visiting_team_id = game.competitors[0].id;');
   d.writeln('         visiting_score   = game.competitors[0].score;');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      if (game.competitors[1].homeAway == "away")');
   d.writeln('      {');
   d.writeln('         visiting_team    = game.competitors[1].team.name;');
   d.writeln('         visiting_team_id = game.competitors[1].id;');
   d.writeln('         visiting_score   = game.competitors[1].score;');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      // If home_team or visiting_team is undefined, set to "Football Team".');
   d.writeln('');
   d.writeln('      if (home_team     == undefined) home_team     = "Football Team";');
   d.writeln('      if (visiting_team == undefined) visiting_team = "Football Team";');
   d.writeln('');
   d.writeln('      // Loop through this week\'s games.');
   d.writeln('');
   d.writeln('      for (var j = 0; j < number_of_rs_games; j++)');
   d.writeln('      {');
   d.writeln('         // If the home and visiting teams from the game information match one of this week\'s games, then get the game information.');
   d.writeln('');
   d.writeln('         if ( (home_team.toLowerCase() != home_teams[j].toLowerCase()) || (visiting_team.toLowerCase() != visiting_teams[j].toLowerCase()) )');
   d.writeln('         {');
   d.writeln('            // Skip this game.');
   d.writeln('');
   d.writeln('            continue;');
   d.writeln('         }');
   d.writeln('');
   d.writeln('         // Determine the status and state of the current game.');
   d.writeln('');
   d.writeln('         if (game.status.type.description == "Scheduled")');
   d.writeln('         {');
   d.writeln('            game_status = "game_not_started";');
   d.writeln('            game_state  = "";');
   d.writeln('         }');
   d.writeln('         else if (game.status.type.description == "Halftime")');
   d.writeln('         {');
   d.writeln('            game_status = "halftime";');
   d.writeln('            game_state  = "H";');
   d.writeln('         }');
   d.writeln('         else if (game.status.type.description == "Final")');
   d.writeln('         {');
   d.writeln('            game_status = "game_over";');
   d.writeln('            game_state  = "F";');
   d.writeln('');
   d.writeln('            if (game.status.period >= 5) game_state = "F OT";');//JLJL
   d.writeln('         }');
   d.writeln('         else');
   d.writeln('         {');
   d.writeln('            game_status = "game_in_progress";');
   d.writeln('');
   d.writeln('            // Set the game state to the game quarter or overtime.');
   d.writeln('');
   d.writeln('            if (game.status.period == 1) game_state = "1st";');
   d.writeln('            if (game.status.period == 2) game_state = "2nd";');
   d.writeln('            if (game.status.period == 3) game_state = "3rd";');
   d.writeln('            if (game.status.period == 4) game_state = "4th";');
   d.writeln('            if (game.status.period >= 5) game_state = "OT";');
   d.writeln('');
   d.writeln('            // Set the game clock string.');
   d.writeln('');
   d.writeln('            game_clock_string = game.status.displayClock;');
   d.writeln('');
   d.writeln('            // Determine if there are two minutes or less to play in the 2nd quarter, 4th quarter, or overtime.');
   d.writeln('');
   d.writeln('            if ( (game_state.substring(0,1) == "2") || (game_state.substring(0,1) == "4") || (game_state.substring(0,1) == "O") )');
   d.writeln('            {');
   d.writeln('               if (game_clock_string != "")');
   d.writeln('               {');
   d.writeln('                  game_clock_integer = game_clock_string;');
   d.writeln('                  game_clock_integer = game_clock_integer.replace(/:/g,"");  // Remove the ":".');
   d.writeln('                  game_clock_integer = game_clock_integer - 0;               // Make sure game_clock is an integer.');
   d.writeln('');
   d.writeln('                  if (game_clock_integer <= 200)');
   d.writeln('                  {');
   d.writeln('                     // Set the color of the game clock string to red to indicate two minutes or less to go.');
   d.writeln('');
   d.writeln('                     game_clock_string = "<font color=red>" + game_clock_string + "</font>";');
   d.writeln('                  }');
   d.writeln('               }');
   d.writeln('            }');
   d.writeln('');
   d.writeln('            // Remove leading zero in the game_clock_string.');
   d.writeln('');
   d.writeln('            if (game_clock_string.charAt(game_clock_string.indexOf(":")-2) == "0")');
   d.writeln('            {');
   d.writeln('               temp_string  = game_clock_string.substring(0,game_clock_string.indexOf(":")-2);');
   d.writeln('               temp_string += game_clock_string.substring(game_clock_string.indexOf(":")-1);');
   d.writeln('');
   d.writeln('               game_clock_string = temp_string;');
   d.writeln('            }');
   d.writeln('');
   d.writeln('            // Add the game clock to the game state.');
   d.writeln('');
   d.writeln('            game_state = game_state + " " + game_clock_string;');
   d.writeln('');
   d.writeln('            // Add the down, yards to go, and yard line to the game state.');
   d.writeln('');
   d.writeln('            if (game.situation.downDistanceText != undefined) game_state = game_state + "<br><font size=-2>" + game.situation.downDistanceText + "</font>";');
   d.writeln('');



   d.writeln('            // Determine which team has possession of the ball and if they\'re in the red zone.');
   d.writeln('');

   d.writeln('            if ( (game.situation.possession != undefined) && (game.situation.possession = home_team_id)     ) possession_team = home_team;');
   d.writeln('            if ( (game.situation.possession != undefined) && (game.situation.possession = visiting_team_id) ) possession_team = visiting_team;');
   d.writeln('');

   d.writeln('            for (var k = 0; k < nfl_team_names.length; k++)');
   d.writeln('            {');
   d.writeln('               if (possession_team == nfl_team_names[k])');
   d.writeln('               {');
   d.writeln('                  window.top.gv.prelim_possession_teams[possession_teams_index] = nfl_team_names[k];');
   d.writeln('');
   d.writeln('                  if ( (game.situation.isRedZone != undefined) && (game.situation.isRedZone == "true") )');
   d.writeln('                  {');
   d.writeln('                     //alert("RZ: "+possession_team);window.top.gv.prelim_red_zone_flags[possession_teams_index] = true;');
   d.writeln('                  }');
   d.writeln('');
   d.writeln('                  possession_teams_index++;');
   d.writeln('');
   d.writeln('                  break;');
   d.writeln('               }');
   d.writeln('            }');




   d.writeln('         }');
   d.writeln('');


   d.writeln('         //alert(":"+visiting_team+":"+visiting_score+":"+home_team+":"+home_score+":"+game_status+":"+game_state);');//JLJL
   d.writeln('');
   d.writeln('         // If the current game is over or in progress, determine who the winning team is and save it.');
   d.writeln('');
   d.writeln('         if (game_status != "game_not_started")');
   d.writeln('         {');
   d.writeln('            games_in_progress = true;');
   d.writeln('');
   d.writeln('            if (visiting_score > home_score)');
   d.writeln('            {');
   d.writeln('               winning_teams[winning_teams_index] = visiting_team;');
   d.writeln('');
   d.writeln('               winning_teams_index++;');
   d.writeln('');
   d.writeln('               if (game_status == "game_over")');
   d.writeln('               {');
   d.writeln('                  window.top.gv.prelim_victors[prelim_victors_index] = visiting_team;');
   d.writeln('');
   d.writeln('                  prelim_victors_index++;');
   d.writeln('               }');
   d.writeln('            }');
   d.writeln('            else if (home_score > visiting_score)');
   d.writeln('            {');
   d.writeln('               winning_teams[winning_teams_index] = home_team;');
   d.writeln('');
   d.writeln('               winning_teams_index++;');
   d.writeln('');
   d.writeln('               if (game_status == "game_over")');
   d.writeln('               {');
   d.writeln('                  window.top.gv.prelim_victors[prelim_victors_index] = home_team;');
   d.writeln('');
   d.writeln('                  prelim_victors_index++;');
   d.writeln('               }');
   d.writeln('            }');
   d.writeln('            else if ( (home_score == visiting_score) && (game_status == "game_over") )');
   d.writeln('            {');
   d.writeln('               // Must put either the home or visitor team in the prelim_victors array so we know later that this "Tie" game is over.');
   d.writeln('');
   d.writeln('               window.top.gv.prelim_victors[prelim_victors_index] = home_team;');
   d.writeln('');
   d.writeln('               prelim_victors_index++;');
   d.writeln('            }');
   d.writeln('');
   d.writeln('            for (var k = 0; k < number_of_rs_games; k++)');
   d.writeln('            {');
   d.writeln('               // The visiting_scores array, home_scores array, and game_state are strictly for display purposes only.');
   d.writeln('');
   d.writeln('               if ( (visiting_teams[k] == visiting_team) && (home_teams[k] == home_team) )');
   d.writeln('               {');
   d.writeln('                  window.top.gv.visiting_scores[k]    = "&nbsp;&nbsp;" + visiting_score;');
   d.writeln('                  window.top.gv.home_scores[k]        = "&nbsp;&nbsp;" + home_score;');
   d.writeln('                  window.top.gv.prelim_game_states[k] = "<font size=-1>" + game_state + "</font>";');
   d.writeln('               }');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (games_in_progress == false)');
   d.writeln('   {');
   d.writeln('      alert("There are no Week " + week + " games in progress yet.");');
   d.writeln('');
   d.writeln('      // Force auto refresh to be off if no games are in progress.');
   d.writeln('');
   d.writeln('      window.top.gv.get_scores_state = "off";');
   d.writeln('   }');
   d.writeln('   else');
   d.writeln('   {');
   d.writeln('      // Update window.top.gv.prelim_winners so that the winners will appear on the form when it is redisplayed.');
   d.writeln('');
   d.writeln('      for (var i = 0; i < number_of_rs_games; i++)');
   d.writeln('      {');
   d.writeln('         window.top.gv.prelim_winners[i] = "0";');
   d.writeln('');
   d.writeln('         for (var j = 0; j < number_of_rs_games; j++)');
   d.writeln('         {');
   d.writeln('            if (visiting_teams[i] == winning_teams[j])');
   d.writeln('            {');
   d.writeln('               window.top.gv.prelim_winners[i] = "V";');
   d.writeln('            }');
   d.writeln('            else if (home_teams[i] == winning_teams[j])');
   d.writeln('            {');
   d.writeln('               window.top.gv.prelim_winners[i] = "H";');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Redisplay the preliminary form.');
   d.writeln('');
   d.writeln('   document.location.href = "fp_regular_season_form.html";');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function respond_to_best_outcome_button(document)');
   d.writeln('{');
   d.writeln('   // Set cursor to "wait" (busy).');
   d.writeln('');
   d.writeln('   document.body.style.cursor = "wait";');
   d.writeln('');
   d.writeln('   // Use setTimeout to call determine_best_outcome so busy cursor will be active.');
   d.writeln('');
   d.writeln('   // Before every return call in determine_best_outcome there must be a call to:  document.body.style.cursor = "auto";');
   d.writeln('');
   d.writeln('   setTimeout("determine_best_outcome(document)",500);');
   d.writeln('}');
   d.writeln('');
   d.writeln('</'+'script>');
   d.writeln('');
   d.writeln('');
   d.writeln('<center>');
   d.writeln('');
   if ( (top.gv.mobile != true) || (navigator.platform == "iPad") )
   {
      d.writeln('<font style="font-family: Calibri; font-size: 16pt; font-weight: bold; padding: 10px">'+document_heading+'</font><p>');
      d.writeln('');
   }

   d.writeln('<form name="fp_results">');
   d.writeln('');

   d.writeln('<table align=center');
   d.writeln('       class="b3_border"');
   d.writeln('      border=0');
   d.writeln('     bgcolor=white');
   d.writeln(' cellpadding=2');
   d.writeln(' cellspacing=0');
   d.writeln('          id="regular_season_table">');
   d.writeln('');

   d.writeln('<tr align=center bgcolor=#C4D79B height=21px>');
   d.writeln('<td class="br2_bb2_border" colspan=4>');
   if (mode == "prelim")
   {
      d.writeln('<font style="font-size: 13pt"><b>Week&nbsp;&nbsp;'+week+'&nbsp;&nbsp;'+mode_string+'</b></font>');
   }
   else
   {
      d.writeln('<select style="font-family: Calibri; font-size: 13pt; font-weight: bold; background-color: #C4D79B; border: 1px solid gray" name="selected_week_menu" size=1');
      d.writeln('  onChange="change_week(document); return true;">');
      for (var i = 1; i <= unaltered_week; i++)
      {
         if (i == week)
         {
            d.writeln('   <option selected value="'+i+'">&nbsp;&nbsp;Week&nbsp;&nbsp;'+i+'&nbsp;&nbsp;Final&nbsp;&nbsp;');
         }
         else
         {
            d.writeln('   <option          value="'+i+'">&nbsp;&nbsp;Week&nbsp;&nbsp;'+i+'&nbsp;&nbsp;Final&nbsp;&nbsp;');
         }
      }
      d.writeln('</select>');
   }
   d.writeln('</td>');
   for (var i = 1; i <= number_of_rs_players; i++)
   {
      if (i == number_of_rs_players)
      {
         d.writeln('<td class="bb2_border" colspan='+player_colspan+'><font style="font-size: 13pt"><b>'+rs_players[player_index[i-1]]+'</b></font></td>');
      }
      else
      {
         d.writeln('<td class="br2_bb2_border" colspan='+player_colspan+'><font style="font-size: 13pt"><b>'+rs_players[player_index[i-1]]+'</b></font></td>');
      }
   }
   d.writeln('</tr>');
   d.writeln('');

   d.writeln('<tr align=center bgcolor=#DCE6F1 height=21px>');
   d.writeln('<td class="bb2_border"><font style="font-size: 12pt"><b>Visitor</b></font></td>');
   d.writeln('<td class="bb2_border"><font style="font-size: 12pt"><b>vs</b></font></td>');
   d.writeln('<td class="gr1_bb2_border"><font style="font-size: 12pt"><b>Home</b></font></td>');
   d.writeln('<td class="br2_bb2_border"><font style="font-size: 12pt"><b>Winner</b></font></td>');
   for (var i = 1; i <= number_of_rs_players; i++)
   {
      if (form_view == "expanded")
      {
         d.writeln('<td class="gr1_bb2_border" colspan=2><font style="font-size: 11pt"><b>Pick</b></font></td>');
      }
      if (i == number_of_rs_players)
      {
         d.writeln('<td class="bb2_border"><font style="font-size: 11pt"><b>Score</b></font></td>');
      }
      else
      {
         d.writeln('<td class="br2_bb2_border"><font style="font-size: 11pt"><b>Score</b></font></td>');
      }
   }
   d.writeln('</tr>');
   d.writeln('');

   for (var i = 1; i <= number_of_rs_games; i++)
   {
      if (mode == "prelim")
      {
         for (var j = 1; j <= number_of_rs_games; j++)
         {
            input_tag_style = "font-size:11pt; font-family: Calibri; border: 1px solid lightgray";

            if ( (visiting_teams[i-1] == victors[j-1]) || (home_teams[i-1] == victors[j-1]) )
            {
               // Highlight the background of the pick to signify that the game has concluded.

               input_tag_style = "font-size:11pt; font-family: Calibri; border: 1px solid lightgray; background-color:#DCE6F1;";

               // Check for a game ending in a tie.

               if (visiting_scores[i-1] == home_scores[i-1]) winners[i-1] = "Tie";

               break;
            }
         }

         // Determine which team (if any) has possession of the ball and if they're in the red zone.

         bullet_color                  = color_black;
         home_team_possession_flag     = "";
         visiting_team_possession_flag = "";

         for (var j = 1; j <= number_of_rs_games; j++)
         {
            if (prelim_possession_teams[j-1] == visiting_teams[i-1])
            {
               // Set the visiting team possession flag.

               if (prelim_red_zone_flags[j-1] == true) bullet_color = color_red;

               visiting_team_possession_flag = "<span style='font-weight:bold; color:"+bullet_color+"'>\u2022&nbsp;</span>";

               break;
            }
            else if (prelim_possession_teams[j-1] == home_teams[i-1])
            {
               // Set the home team possession flag.

               if (prelim_red_zone_flags[j-1] == true) bullet_color = color_red;

               home_team_possession_flag = "<span style='font-weight:bold; color:"+bullet_color+"'>\u2022&nbsp;</span>";

               break;
            }
         }

         // Set the game state flag (quarter, halftime, or overtime) if the game is in progress.

         game_state = window.top.gv.prelim_game_states[i-1];
      }

      d.writeln('<tr align=center height=18px>');
      if (winners[i-1] == "V")
      {
         if (i == number_of_rs_games)
         {
            d.writeln('<td nowrap class="gr1_bb1_border"><font style="font-size: 12pt" color=blue>'+visiting_team_possession_flag+visiting_teams[i-1]+visiting_scores[i-1]+'</font></td>');
         }
         else
         {
            d.writeln('<td nowrap><font style="font-size: 12pt" color=blue>'+visiting_team_possession_flag+visiting_teams[i-1]+visiting_scores[i-1]+'</font></td>');
         }
      }
      else
      {
         if (i == number_of_rs_games)
         {
            d.writeln('<td nowrap class="gr1_bb1_border"><font style="font-size: 12pt">'+visiting_team_possession_flag+visiting_teams[i-1]+visiting_scores[i-1]+'</font></td>');
         }
         else
         {
            d.writeln('<td nowrap><font style="font-size: 12pt">'+visiting_team_possession_flag+visiting_teams[i-1]+visiting_scores[i-1]+'</font></td>');
         }
      }
      if (i == number_of_rs_games)
      {
         d.writeln('<td nowrap class="gr1_bb1_border"><font style="font-size: 12pt">'+game_state+'</font></td>');
      }
      else
      {
         d.writeln('<td nowrap><font style="font-size: 12pt">'+game_state+'</font></td>');
      }
      if (winners[i-1] == "H")
      {
         if (i == number_of_rs_games)
         {
            d.writeln('<td nowrap class="gr1_bb1_border"><font style="font-size: 12pt" color=blue>'+home_team_possession_flag+home_teams[i-1]+home_scores[i-1]+'</font></td>');
         }
         else
         {
            d.writeln('<td nowrap><font style="font-size: 12pt" color=blue>'+home_team_possession_flag+home_teams[i-1]+home_scores[i-1]+'</font></td>');
         }
      }
      else
      {
         if (i == number_of_rs_games)
         {
            d.writeln('<td nowrap class="gr1_bb1_border"><font style="font-size: 12pt">'+home_team_possession_flag+home_teams[i-1]+home_scores[i-1]+'</font></td>');
         }
         else
         {
            d.writeln('<td nowrap><font style="font-size: 12pt">'+home_team_possession_flag+home_teams[i-1]+home_scores[i-1]+'</font></td>');
         }
      }
      if (mode == "prelim")
      {
         if (i == number_of_rs_games)
         {
            d.writeln('<td class="br2_bb1_border"><select style="'+input_tag_style+'" name="winner'+i+'" size=1>');
         }
         else
         {
            d.writeln('<td class="br2_gb1_border"><select style="'+input_tag_style+'" name="winner'+i+'" size=1>');
         }
         if (winners[i-1] == "0")
         {
            d.writeln('       <option selected value="0"> ');
         }
         else
         {
            d.writeln('       <option          value="0"> ');
         }
         if (winners[i-1] == "H")
         {
            d.writeln('       <option selected value="H">H');
         }
         else
         {
            d.writeln('       <option          value="H">H');
         }
         if (winners[i-1] == "V")
         {
            d.writeln('       <option selected value="V">V');
         }
         else
         {
            d.writeln('       <option          value="V">V');
         }
         if (winners[i-1] == "Tie")
         {
            d.writeln('       <option selected value="Tie">Tie');
         }
         else
         {
            d.writeln('       <option          value="Tie">Tie');
         }
         d.writeln('    </select></td>');
      }
      else
      {
         if (i == number_of_rs_games)
         {
            d.writeln('<td class="br2_bb1_border"><font style="font-size: 12pt">'+winners[i-1]+'</font></td>');
         }
         else
         {
            d.writeln('<td class="br2_gb1_border"><font style="font-size: 12pt">'+winners[i-1]+'</font></td>');
         }
      }
      for (var ii = 1; ii <= number_of_rs_players; ii++)
      {
         if (form_view == "expanded")
         {
            if (picks[player_index[ii-1]].length > 0)
            {
               if (i == number_of_rs_games)
               {
                  d.writeln('<td class="gr1_bb1_border"><font style="font-size: 12pt">'+picks[player_index[ii-1]][i-1]+'</font></td>');  
                  d.writeln('<td class="gr1_bb1_border"><font style="font-size: 12pt">'+weights[player_index[ii-1]][i-1]+'</font></td>');
               }
               else
               {
                  d.writeln('<td><font style="font-size: 12pt">'+picks[player_index[ii-1]][i-1]+'</font></td>');  
                  d.writeln('<td><font style="font-size: 12pt">'+weights[player_index[ii-1]][i-1]+'</font></td>');
               }
            }
            else
            {
               if (i == number_of_rs_games)
               {
                  d.writeln('<td class="gr1_bb1_border"><font style="font-size: 12pt"><br></font></td>');
                  d.writeln('<td class="gr1_bb1_border"><font style="font-size: 12pt"><br></font></td>');
               }
               else
               {
                  d.writeln('<td><font style="font-size: 12pt"><br></font></td>');
                  d.writeln('<td><font style="font-size: 12pt"><br></font></td>');
               }
            }  
         }
         if (picks[player_index[ii-1]].length > 0)
         {
            if ( (winners[i-1] != "0") && (picks[player_index[ii-1]][i-1] != winners[i-1]) )
            {
               if (ii == number_of_rs_players)
               {
                  if (i == number_of_rs_games)
                  {
                     d.writeln('<td class="bb1_border"><font style="font-size: 12pt" color=red>-'+weights[player_index[ii-1]][i-1]+'</font></td>');
                  }
                  else
                  {
                     d.writeln('<td class="gb1_border"><font style="font-size: 12pt" color=red>-'+weights[player_index[ii-1]][i-1]+'</font></td>');
                  }
               }
               else
               {
                  if (i == number_of_rs_games)
                  {
                     d.writeln('<td class="br2_bb1_border"><font style="font-size: 12pt" color=red>-'+weights[player_index[ii-1]][i-1]+'</font></td>');
                  }
                  else
                  {
                     d.writeln('<td class="br2_gb1_border"><font style="font-size: 12pt" color=red>-'+weights[player_index[ii-1]][i-1]+'</font></td>');
                  }
               }
            }
            else
            {
               if (ii == number_of_rs_players)
               {
                  if (i == number_of_rs_games)
                  {
                     d.writeln('<td class="bb1_border"><font style="font-size: 12pt"><br></font></td>');
                  }
                  else
                  {
                     d.writeln('<td class="gb1_border"><font style="font-size: 12pt"><br></font></td>');
                  }
               }
               else
               {
                  if (i == number_of_rs_games)
                  {
                     d.writeln('<td class="br2_bb1_border"><font style="font-size: 12pt"><br></font></td>');
                  }
                  else
                  {
                     d.writeln('<td class="br2_gb1_border"><font style="font-size: 12pt"><br></font></td>');
                  }
               }
            }
         }
         else
         {
            if (ii == number_of_rs_players)
            {
               if (i == number_of_rs_games)
               {
                  d.writeln('<td class="bb1_border"><font style="font-size: 12pt"><br></font></td>');
               }
               else
               {
                  d.writeln('<td class="gb1_border"><font style="font-size: 12pt"><br></font></td>');
               }
            }
            else
            {
               if (i == number_of_rs_games)
               {
                  d.writeln('<td class="br2_bb1_border"><font style="font-size: 12pt"><br></font></td>');
               }
               else
               {
                  d.writeln('<td class="br2_gb1_border"><font style="font-size: 12pt"><br></font></td>');
               }
            }
         }
      }
      d.writeln('</tr>');  
      d.writeln('');
   }
   d.writeln('');

   d.writeln('<tr align=center height=15px>');
   d.writeln('<td class="br2_border" align=right colspan=4 nowrap>');
   d.writeln('<font style="font-size: 10pt">Monday Night Total Points'+mn_points_string+':&nbsp;</font>');
   d.writeln('</td>');
   for (var i = 1; i <= number_of_rs_players; i++)
   {
      if (mn_points[player_index[i-1]].length == 0) mn_points[player_index[i-1]] = "<br>";

      if ( (tie_breaker_needed == true) &&
           (actual_mn_points > 0)       &&
           (mn_points_delta[player_index[i-1]] != "N/A") )
      {
         mn_points_delta_string = "diff: "+ mn_points_delta[player_index[i-1]];
      }
      else
      {
         mn_points_delta_string = "<br>";
      }

      if (form_view == "expanded")
      {
         if (picks[player_index[i-1]].length > 0)
         {
            d.writeln('<td class="gr1_border" align=right><font style="font-size: 9pt">pts:</font></td>');
         }
         else
         {
            d.writeln('<td class="gr1_border" align=right><font style="font-size: 9pt"><br></font></td>');
         }
         d.writeln('<td class="gr1_border"><font style="font-size: 9pt">'+mn_points[player_index[i-1]]+'</font></td>');
         if (i == number_of_rs_players)
         {
            d.writeln('<td class="no_border" nowrap><font style="font-size: 9pt">'+mn_points_delta_string+'</font></td>');
         }
         else
         {
            d.writeln('<td class="br2_border" nowrap><font style="font-size: 9pt">'+mn_points_delta_string+'</font></td>');
         }
      }
      else
      {
         if (i == number_of_rs_players)
         {
            d.writeln('<td class="no_border"><font style="font-size: 9pt">'+mn_points[player_index[i-1]]+'</font></td>');
         }
         else
         {
            d.writeln('<td class="br2_border"><font style="font-size: 9pt">'+mn_points[player_index[i-1]]+'</font></td>');
         }
      }
   }
   d.writeln('</tr>');
   d.writeln('');

   d.writeln('<tr align=center height=21px>');
   d.writeln('<td class="bt2_br2_border" align=right colspan=4>');
   d.writeln('<font style="font-size: 12pt"><b>Scores:&nbsp;</b></font>');
   d.writeln('</td>');
   for (var i = 1; i <= number_of_rs_players; i++)
   {
      if (form_view == "expanded")
      {
         d.writeln('<td class="bt2_gr1_border" colspan=2 align=center><font style="font-size: 12pt" color=blue>'+ranks[player_index[i-1]]+'</font></td>');
      }
      if (picks[player_index[i-1]].length > 0)
      {
         if (ranks[player_index[i-1]] == 1)
         {
            if (i == number_of_rs_players)
            {
               d.writeln('<td class="bt2_border" bgcolor=#DCE6F1><font style="font-size: 12pt" color=blue>'+scores[player_index[i-1]]+'</font></td>');
            }
            else
            {
               d.writeln('<td class="bt2_br2_border" bgcolor=#DCE6F1><font style="font-size: 12pt" color=blue>'+scores[player_index[i-1]]+'</font></td>');
            }
         }
         else
         {
            if (i == number_of_rs_players)
            {
               d.writeln('<td class="bt2_border"><font style="font-size: 12pt" color=blue>'+scores[player_index[i-1]]+'</font></td>');
            }
            else
            {
               d.writeln('<td class="bt2_br2_border"><font style="font-size: 12pt" color=blue>'+scores[player_index[i-1]]+'</font></td>');
            }
         }
      }
      else
      {
         if (i == number_of_rs_players)
         {
            d.writeln('<td class="bt2_border"><font style="font-size: 12pt" color=blue>0</font></td>');
         }
         else
         {
            d.writeln('<td class="bt2_br2_border"><font style="font-size: 12pt" color=blue>0</font></td>');
         }
      }
   }
   d.writeln('</tr>');
   d.writeln('');

   d.writeln('</table>');
   d.writeln('');

   if (mode == "prelim")
   {
      if (tie_breaker_needed == true)
      {
         var mn_pts_value        = window.top.gv.mn_points_entered;
         var temp_mn_points      = -1;
         var tie_breaker_message = "";


         if (unable_to_break_tie == false)
         {
            // Determine if the players that are tied have the same Monday Night Total Points prediction.

            for (var i = 1; i <= number_of_rs_games; i++)
            {
               if (ranks[i-1] == 1)
               {
                  if (temp_mn_points == -1)
                  {
                     temp_mn_points = mn_points[i-1];
                  }
                  else if (temp_mn_points != mn_points[i-1])
                  {
                     // Not all players that are tied have the same Monday Night Total Points prediction.

                     unable_to_break_tie = false;

                     break;
                  }
                  else
                  {
                     unable_to_break_tie = true;
                  }
               }
            }
         }

         if (unable_to_break_tie == true)
         {
            // Clear out the Monday Night Total Points entry field on the preliminary form.

            window.top.gv.mn_points_entered = 0;
            mn_pts_value                    = "";

            tie_breaker_message  = "Unable to break the tie.&nbsp;&nbsp;";
            tie_breaker_message += "Players tied have the same Monday Night Total Points prediction.";
         }
         else
         {
            tie_breaker_message = "Enter actual Monday Night Total Points to break the tie:&nbsp;&nbsp;";
         }

         if ( (unable_to_break_tie == true) || (in_progress_mn_points < 1) )
         {
            d.writeln('<table align=center>');
            d.writeln('<tr><td class="no_border" style="font-size: 2pt">&nbsp;</td></tr>');
            d.writeln('<tr><td class="no_border"><font style="font-size: 13pt">'+tie_breaker_message+'</font>');

            if (unable_to_break_tie == false)
            {
               if (mn_pts_value == 0) mn_pts_value = "";

               d.writeln('<input type=text style="text-align: center; font-size: 11pt; font-family: Calibri; border: 1px solid black" name="mn_points" size="3" maxlength="3" value="'+mn_pts_value+'"');
               d.writeln('              onChange="get_mn_points(document);return true;"');
               d.writeln('            onKeyPress="if (window.event.keyCode==13) {window.event.keyCode=0; get_mn_points(document); calculate_prelim_scores(document); return true;}">');
            }

            d.writeln('</td></tr></table>');
         }
      }
      else
      {
         window.top.gv.mn_points_entered = 0;
      }
   }

   d.writeln('<table cols=1 align=center>');
   d.writeln('');

   d.writeln('<tr><td class="no_border" style="font-size: 2pt">&nbsp;</td></tr>');
   d.writeln('');
   if (mode == "prelim")
   {
      d.writeln('<tr align=center>');
      d.writeln('<td nowrap valign=middle class="no_border">');
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="get_scores_button" value="Get NFL Scores"');
      d.writeln('    onClick=get_nfl_scores(document,false,"");>');
      d.writeln('&nbsp;');
      d.writeln('<font style="font-size: 12pt">Auto Refresh:</font>&nbsp;');
      if (window.top.gv.get_scores_state == "off")
      {
         d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="get_scores_start_button" value="Start"');
         d.writeln('    onClick=get_scores_auto_refresh(document,"start");get_nfl_scores(document,false,"Start");>');
      }
      else
      {
         d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="get_scores_stop_button" value="Stop"');
         d.writeln('    onClick=get_scores_auto_refresh(document,"stop");document.location.href="fp_regular_season_form.html";>');
      }
      d.writeln('</td>');
      d.writeln('</tr>');
      d.writeln('<tr><td class="no_border" style="font-size: 2pt">&nbsp;</td></tr>');
   }
   d.writeln('<tr align=center>');
   d.writeln('<td nowrap valign=middle class="no_border">');
   if (mode == "prelim")
   {
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="calculate_scores_button" value="Calculate Player Scores"');
      d.writeln('    onClick="calculate_prelim_scores(document);return true;">');
      d.writeln('&nbsp;');
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="clear_winners_button" value="Clear Winners"');
      d.writeln('    onClick="clear_winners(document);return true;">');
      d.writeln('&nbsp;');
   }
   if (order_by == "players")
   {
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="order_by_button" value="Order By Score"');
   }
   else
   {
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="order_by_button" value="Order By Player"');
   }
   d.writeln('    onClick="change_order(document);return true;">');
   d.writeln('&nbsp;');
   if (form_view == "expanded")
   {
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="view_button" value="Hide Picks"');
   }
   else
   {
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="view_button" value="Show Picks"');
   }
   d.writeln('    onClick="change_view(document);return true;">');
   d.writeln('&nbsp;');
   d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="close_button" value="Close"');
   d.writeln('    onClick="javascript:window.top.close();">');
   d.writeln('</td>');
   d.writeln('</tr>');
   d.writeln('');
   if (mode == "prelim")
   {
      d.writeln('<tr><td class="no_border" style="font-size: 2pt">&nbsp;</td></tr>');
      d.writeln('<tr align=center>');
      d.writeln('<td nowrap valign=middle class="no_border">');
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="best_outcome" value="Best Outcome:"');
      d.writeln('     onClick="respond_to_best_outcome_button(document);return true;" title="'+best_outcome_tooltip+'">');
      d.writeln('&nbsp;');
      d.writeln('<font style="font-size: 12pt">Player:</font>&nbsp;');
      d.writeln('<select style="font-size: 11pt; font-family: Calibri; border: 1px solid black" name="player_name_menu" size=1');
      d.writeln('     onChange="get_selected_player(document);return true;">');
      for (var player_index = 0; player_index <= number_of_rs_players; player_index++)
      {
         // Only add players to the menu if they submitted their picks.

         if ( (player_index == 0) || ((player_index > 0) && (picks[player_index-1].length > 0)) )
         {
            temp_name = build_player_name(player_index,true);

            if (player_index == window.top.gv.player_index)
            {
                  d.writeln('   <option selected value="'+player_index+'">'+temp_name);
            }
            else
            {
                  d.writeln('   <option          value="'+player_index+'">'+temp_name);
            }
         }
      }
      d.writeln('</select>')
      d.writeln('&nbsp;');
      d.writeln('<font style="font-size: 12pt">Opponent:</font>&nbsp;');
      d.writeln('<select style="font-size: 11pt; font-family: Calibri; border: 1px solid black" name="opponent_name_menu" size=1');
      d.writeln('     onChange="get_selected_opponent(document);return true;">');
      for (var opponent_index = 0; opponent_index <= number_of_rs_players; opponent_index++)
      {
         // Only add opponents to the menu if they submitted their picks.

         if ( (opponent_index == 0) || ((opponent_index > 0) && (picks[opponent_index-1].length > 0)) )
         {
            temp_name = build_player_name(opponent_index,true);

            if (opponent_index == 0) temp_name = "All";

            if (opponent_index == window.top.gv.opponent_index)
            {
                  d.writeln('   <option selected value="'+opponent_index+'">'+temp_name);
            }
            else
            {
                  d.writeln('   <option          value="'+opponent_index+'">'+temp_name);
            }
         }
      }
      d.writeln('</select>')
      d.writeln('</td>');
      d.writeln('</tr>');
      d.writeln('');
   }
   if (number_of_rs_games < max_number_of_rs_games)
   {
      d.writeln('<tr align=center>');
      d.writeln('<td class="no_border">');
      d.writeln('<br><font style="font-size: 12pt"><b>Open Date:</b>&nbsp;&nbsp;'+open_date+'</font>');
      d.writeln('</td>');
      d.writeln('</tr>');
      d.writeln('');
   }
   d.writeln('</table>');
   d.writeln('');

   d.writeln('</form>');
   d.writeln('');

   d.writeln('</center>');
   d.writeln('');

   if (mode == "prelim")
   {
      if (window.top.gv.mobile != true)
      {
         for (var i = 1; i <= number_of_rs_games; i++)
         {
            if (winners[i-1] == "0")
            {
               d.writeln('<script>document.fp_results.winner'+i+'.focus();</'+'script>');
               break;
            }
            d.writeln('<script>document.fp_results.view_button.focus();</'+'script>');
         }
      }

      if (window.top.gv.get_scores_timer != null)
      {
         clearInterval(window.top.gv.get_scores_timer);
      }

      if (window.top.gv.get_scores_state == "on")
      {
         window.top.gv.get_scores_timer = setInterval('get_nfl_scores(document,false,"");',10000);
      }
   }
   else
   {
      if (window.top.gv.mobile != true) d.writeln('<script>document.fp_results.view_button.focus();</'+'script>');
   }
   d.writeln('');

   d.writeln('</body>');
   d.writeln('');

   d.writeln('</html>');

   adjust_mobile_viewport_height(d);

   if ( (top.gv.mobile == true) && (navigator.platform != "iPad") )
   {
      d.body.scrollLeft = 0;
      d.body.scrollTop  = 0;
   }
   else
   {
      d.getElementById("regular_season_table").scrollIntoView();
   }

   d.close();

   return true;
}


function build_season_summary()
{
   if (check_for_opener() == false)
   {
      window.top.close();

      return false;
   }

   var rs_players                = window.top.gv.rs_players;
   var number_of_rs_players      = rs_players.length;
   var number_of_rs_weeks        = window.top.gv.all_home_teams.length;

   var actual_mn_points          = "";
   var all_games_won             = Array(number_of_rs_weeks);
   var all_ranks                 = Array(number_of_rs_weeks);
   var all_scores                = Array(number_of_rs_weeks);
   var best_mn_points_delta      = 1000;
   var best_total_average_ranks  = 12.0;
   var best_total_games_won      = 0;
   var best_total_scores         = 0;
   var bold_end                  = "";
   var bold_start                = "";
   var border_class_1            = "";
   var border_class_2            = "";
   var border_class_3            = "";
   var color_blue                = "blue";
   var color_column_header_1     = "#C4D79B";
   var color_green               = "#008800";
   var color_light_blue          = "#DCE6F1";
   var color_light_yellow        = "#FFFFE1";
   var color_red                 = "red";
   var color_teal                = "#B7DEE8";
   var column_span               = 3;
   var document_heading          = "Regular Season Summary";
   var font_color                = "";
   var form_view                 = window.top.gv.form_view;
   var high_score                = 0;
   var high_score_count          = 0;
   var max_1st_places            = 0;
   var max_2nd_places            = 0;
   var max_3rd_places            = 0;
   var max_last_places           = 0;
   var max_missed_weeks          = 0;
   var mn_points                 = "";
   var mn_points_delta           = Array(number_of_rs_players).fill("N/A");
   var number_of_rs_games        = 0;
   var order_by                  = window.top.gv.order_by;
   var player_low_scores         = Array(number_of_rs_players).fill(999);
   var player_total_average_rank = "<br>";
   var player_total_games_won    = 0;
   var player_total_score        = 0;
   var ranks_adjust              = Array(number_of_rs_players).fill(0);
   var ranks_sum                 = 0;
   var sort_index                = Array(number_of_rs_players).fill().map((_,i) => i);  // Sets sort_index = [0,1,2,3,4,5,6,7,8,9,10,11]
   var sorted_scores             = Array(number_of_rs_players).fill(1);
   var summary_title             = "";
   var table_data                = "";
   var td_background             = "";
   var tie_breaker_needed        = false;
   var total_1st_places          = Array(number_of_rs_players).fill(0);
   var total_2nd_places          = Array(number_of_rs_players).fill(0);
   var total_3rd_places          = Array(number_of_rs_players).fill(0);
   var total_average_ranks       = Array(number_of_rs_players).fill(12);
   var total_games_played        = 0;
   var total_games_won           = Array(number_of_rs_players).fill(0);
   var total_last_places         = Array(number_of_rs_players).fill(0);
   var total_missed_weeks        = Array(number_of_rs_players).fill(0);
   var total_ranks               = Array(number_of_rs_players).fill(1);
   var total_scores              = Array(number_of_rs_players).fill(0);
   var week                      = window.top.gv.current_input_week - 1;
   var weekly_last_place_scores  = Array(number_of_rs_weeks).fill(999);
   var weekly_max_games_won      = 0;
   var weekly_max_score          = 0;
   var weekly_picks              = "";
   var weekly_weights            = "";
   var weekly_winners            = "";
   var weeks_played              = 0;


   if (window.top.gv.games_over == false)       week--;
   if (week <  1)                               week = 1;
   if (week > number_of_rs_weeks)               week = number_of_rs_weeks;
   if (window.top.gv.mode == "summary_archive") week = number_of_rs_weeks;

   summary_title     = "Week&nbsp;&nbsp;"+week+"&nbsp;&nbsp;Final";

   // Build document header.

   if (window.top.gv.mode == "summary_archive")
   {
      document_heading = window.top.gv.archive_year + " " + document_heading;
   }

   if (form_view == "expanded")
   {
      column_span = 3;
   }
   else
   {
      column_span = 1;
   }

   for (var week_index = 0; week_index < week; week_index++)
   {
      actual_mn_points          = all_actual_mn_points[week_index];
      all_games_won[week_index] = Array(12).fill(0);
      all_ranks[week_index]     = Array(12).fill(1);
      all_scores[week_index]    = Array(12).fill(0);
      mn_points                 = all_mn_points[week_index];
      number_of_rs_games        = window.top.gv.all_home_teams[week_index].length;
      ranks_adjust              = Array(number_of_rs_players).fill(0);
      sorted_scores             = Array(number_of_rs_players).fill(1);
      weekly_picks              = all_picks[week_index];
      weekly_weights            = all_weights[week_index];
      weekly_winners            = all_winners[week_index];

      // Calculate scores for the current week.

      for (var player_index = 0; player_index < number_of_rs_players; player_index++)
      {
         if (weekly_picks[player_index].length > 0)
         {
            for (var game_index = 0; game_index < number_of_rs_games; game_index++)
            {
               if ( (weekly_winners[game_index] != "0") && (weekly_picks[player_index][game_index] == weekly_winners[game_index]) )
               {
                  all_games_won[week_index][player_index]++;
                  all_scores[week_index][player_index] = all_scores[week_index][player_index] + (weekly_weights[player_index][game_index]-0);
               }
            }
         }
         else
         {
            all_games_won[week_index][player_index] = 0;
            all_scores   [week_index][player_index] = 0;

            total_missed_weeks[player_index]++;
         }

         total_games_won[player_index] = total_games_won[player_index] + all_games_won[week_index][player_index];
         total_scores[player_index]    = total_scores[player_index]    + all_scores[week_index][player_index];

         if (weekly_picks[player_index].length > 0)
         {
            weekly_last_place_scores[week_index] = Math.min(weekly_last_place_scores[week_index],all_scores[week_index][player_index]);
         }
      }

      // Determine if there's a tie this week.
 
      for (var player_index = 0; player_index < number_of_rs_players; player_index++)
      {
         sorted_scores[player_index] = all_scores[week_index][player_index];
      }

      sorted_scores.sort(function(sorted_scores,b){return sorted_scores-b;});
      sorted_scores.reverse();

      high_score       = sorted_scores[0];
      high_score_count = 0;

      for (var player_index = 0; player_index < number_of_rs_players; player_index++)
      {
         if (all_scores[week_index][player_index] == high_score)
         {
            high_score_count++;

            mn_points_delta[player_index] = mn_points[player_index] - actual_mn_points;
         }
         else
         {
            mn_points_delta[player_index] = "N/A";
         }
      }

      // If there's a tie, try to break the tie using the Monday Night Total Points predictions.

      if (high_score_count > 1)
      {
         tie_breaker_needed = true;

         // If the winner of at least one game is not known, then there's no need for a tie breaker.

         for (var game_index = 0; game_index < number_of_rs_games; game_index++)
         {
            if ((weekly_winners[game_index] != "H") && (weekly_winners[game_index] != "V") && (weekly_winners[game_index] != "Tie"))
            {
               tie_breaker_needed = false;
            }
         }

         // Attempt to break the tie.

         if (tie_breaker_needed == true)
         {
            // The tie can only be broken if the actual Monday Night Total Points are known.

            if (actual_mn_points > 0)
            {
               // Determine the best Monday Night Total Points delta
               // (difference between best prediction and actual).

               best_mn_points_delta = 1000;

               for (var player_index = 0; player_index < number_of_rs_players; player_index++)
               {
                  if (mn_points_delta[player_index] != "N/A")
                  {
                     if ( Math.abs(mn_points_delta[player_index]) < Math.abs(best_mn_points_delta) )
                     {
                        best_mn_points_delta = mn_points_delta[player_index];
                     }
                     else if ( Math.abs(mn_points_delta[player_index]) == Math.abs(best_mn_points_delta) )
                     {
                        if (mn_points_delta[player_index] < best_mn_points_delta)
                        {
                           best_mn_points_delta = mn_points_delta[player_index];
                        }
                     }
                  }
               }

               // Determine if the players that are tied have the same Monday Night Total Points prediction.

               high_score_count = 0;

               for (var player_index = 0; player_index < number_of_rs_players; player_index++)
               {
                  if ( (mn_points_delta[player_index] != "N/A") && (mn_points_delta[player_index] == best_mn_points_delta) )
                  {
                     high_score_count++;
                  }
               }

               // If the players that are tied have the same Monday Night
               // Total Points prediction, then we can't break the tie.

               if (high_score_count > 1)
               {
                  for (var player_index = 0; player_index < number_of_rs_players; player_index++)
                  {
                     // Clear out the Monday Night Total Points delta and adjust
                     // the rank of those players no longer involved in the tie.

                     if ((all_scores[week_index][player_index] == high_score) && (mn_points_delta[player_index] != best_mn_points_delta))
                     {
                        mn_points_delta[player_index] = "N/A";
                        ranks_adjust[player_index]    = high_score_count; 
                     }
                  }
               }
               else
               {
                  // The tie can be broken, so adjust the ranks of the players who lost the tie breaker.

                  for (var player_index = 0; player_index < number_of_rs_players; player_index++)
                  {
                     if ((mn_points_delta[player_index] != "N/A") && (mn_points_delta[player_index] != best_mn_points_delta))
                     {
                        ranks_adjust[player_index] = 1;
                     }
                  }
               }
            }
         }
      }

      // Calculate ranks for the current week.

      for (var player_index_1 = 0; player_index_1 < number_of_rs_players; player_index_1++)
      {
         for (var player_index_2 = 0; player_index_2 < number_of_rs_players; player_index_2++)
         {
            if (all_scores[week_index][player_index_1] == sorted_scores[player_index_2])
            {
               all_ranks[week_index][player_index_1] = (player_index_2 + 1) + ranks_adjust[player_index_1];
               break;
            }
         }
      }
   }

   // Calculate average ranks for each player (don't include weeks that player's missed).

   best_total_average_ranks = 12.0;

   for (var player_index = 0; player_index < number_of_rs_players; player_index++)
   {
      ranks_sum    = 0;
      weeks_played = 0;

      for (var week_index = 0; week_index < week; week_index++)
      {
         weekly_picks   = all_picks[week_index];
         weekly_winners = all_winners[week_index];

         if ( (weekly_winners.length > 0) && (weekly_picks[player_index].length > 0) )
         {
            weeks_played++;

            ranks_sum = ranks_sum + all_ranks[week_index][player_index];
         }
      }

      if (weeks_played > 0)
      {
         total_average_ranks[player_index] = ranks_sum / weeks_played;

         best_total_average_ranks = Math.min(best_total_average_ranks,total_average_ranks[player_index]);
      }
      else
      {
         total_average_ranks[player_index] = "<br>";
      }
   }

   for (var player_index = 0; player_index < number_of_rs_players; player_index++)
   {
      if (week > 1)
      {
         // Determine each player's low score and subtract it from each player's total score if we've played at least 2 weeks.

         for (var week_index = 0; week_index < week; week_index++)
         {
            player_low_scores[player_index] = Math.min(player_low_scores[player_index],all_scores[week_index][player_index]);
         }

         total_scores[player_index] = total_scores[player_index] - player_low_scores[player_index];
      }

      // Determine who has won the most games and who has the highest total score (not including the low score).

      best_total_games_won = Math.max(best_total_games_won,total_games_won[player_index]);
      best_total_scores    = Math.max(best_total_scores,total_scores[player_index]);
   }

   // Calculate total ranks.

   sorted_scores.fill(1);

   for (var player_index = 0; player_index < number_of_rs_players; player_index++)
   {
      sorted_scores[player_index] = total_scores[player_index];
   }

   sorted_scores.sort(function(sorted_scores,b){return sorted_scores-b;});
   sorted_scores.reverse();

   for (var player_index_1 = 0; player_index_1 < number_of_rs_players; player_index_1++)
   {
      for (var player_index_2 = 0; player_index_2 < number_of_rs_players; player_index_2++)
      {
         if (total_scores[player_index_1] == sorted_scores[player_index_2])
         {
            total_ranks[player_index_1] = (player_index_2 + 1);
            break;
         }
      }
   }

   // Determine 1st place, 2nd place, 3rd place, last place, and missed week counts for each player.

   for (var player_index = 0; player_index < number_of_rs_players; player_index++)
   {
      for (var week_index = 0; week_index < week; week_index++)
      {
         if (all_ranks[week_index][player_index] == 1) total_1st_places[player_index]++;
         if (all_ranks[week_index][player_index] == 2) total_2nd_places[player_index]++;
         if (all_ranks[week_index][player_index] == 3) total_3rd_places[player_index]++;
         if (all_scores[week_index][player_index] == weekly_last_place_scores[week_index]) total_last_places[player_index]++;
      }
   }

   for (var player_index = 0; player_index < number_of_rs_players; player_index++)
   {
      max_1st_places   = Math.max(max_1st_places,total_1st_places[player_index]);
      max_2nd_places   = Math.max(max_2nd_places,total_2nd_places[player_index]);
      max_3rd_places   = Math.max(max_3rd_places,total_3rd_places[player_index]);
      max_last_places  = Math.max(max_last_places,total_last_places[player_index]);
      max_missed_weeks = Math.max(max_missed_weeks,total_missed_weeks[player_index]);
   }

   // Calculate sort index.

   for (var player_index_1 = 1; player_index_1 <= number_of_rs_players; player_index_1++)
   {
      if (order_by == "players")
      {
         sort_index[player_index_1-1] = player_index_1-1;
      }
      else
      {
         var duplicates = 0;

         for (var player_index_2 = 1; player_index_2 <= number_of_rs_players; player_index_2++)
         {
            if (player_index_1 == total_ranks[player_index_2-1])
            {
               sort_index[(player_index_1+duplicates)-1] = player_index_2-1;

               duplicates++;
            }
         }

         player_index_1 = player_index_1 + duplicates - 1;
      }
   }

   document.open();

   var d = document;

   d.writeln('<html>');
   d.writeln('');

   d.writeln('<head>');
   d.writeln('   <title>NFL Football Pool</title>');
   d.writeln('   <style type="text/css">');
   d.writeln('   <!--');
   d.writeln('      TD              {border-style:        solid;');
   d.writeln('                       border-color:    lightgray;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .b3_border      {border: 3px solid    black}');
   d.writeln('      .no_border      {border-style:        solid;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .bb1_border     {border-style:        solid;');
   d.writeln('                       border-color:        black;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .bb2_border     {border-style:        solid;');
   d.writeln('                       border-color:        black;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   2px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .br2_border     {border-style:        solid;');
   d.writeln('                       border-color:        black;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .br2_bb1_border {border-style:        solid;');
   d.writeln('                       border-color: white black black white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .br2_bb2_border {border-style:        solid;');
   d.writeln('                       border-color: white black black white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   2px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .br2_gb1_border {border-style:        solid;');
   d.writeln('                       border-color: white black lightgray white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .bt2_border     {border-style:        solid;');
   d.writeln('                       border-color:        black;');
   d.writeln('                       border-top-width:      2px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .bt2_br2_border {border-style:        solid;');
   d.writeln('                       border-color: black black white white;');
   d.writeln('                       border-top-width:      2px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .bt2_gr1_border {border-style:        solid;');
   d.writeln('                       border-color: black lightgray white white;');
   d.writeln('                       border-top-width:      2px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gb1_border     {border-style:        solid;');
   d.writeln('                       border-color:    lightgray;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gr1_border     {border-style:        solid;');
   d.writeln('                       border-color:    lightgray;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gr1_bb1_border {border-style:        solid;');
   d.writeln('                       border-color: white lightgray black white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gr1_bb2_border {border-style:        solid;');
   d.writeln('                       border-color: white lightgray black white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   2px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gr1_gb1_border {border-style:        solid;');
   d.writeln('                       border-color: white lightgray lightgray white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('   -->');
   d.writeln('   </style>');
   d.writeln('</head>');
   d.writeln('');

   d.writeln('<body>');
   d.writeln('');
   d.writeln('');

   d.writeln('<script language="JavaScript">');
   d.writeln('');
   d.writeln('function change_order(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (window.top.gv.order_by == "players")');
   d.writeln('   {');
   d.writeln('      window.top.gv.order_by = "scores";');
   d.writeln('   }');
   d.writeln('   else if (window.top.gv.order_by == "scores")');
   d.writeln('   {');
   d.writeln('      window.top.gv.order_by = "players";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (window.top.gv.mode == "summary_archive")');
   d.writeln('   {');
   d.writeln('      document.location.href = "fp_forms_"+window.top.gv.archive_year+".html";');
   d.writeln('   }');
   d.writeln('   else');
   d.writeln('   {');
   d.writeln('      document.location.href = "fp_regular_season_form.html";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function change_view(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (window.top.gv.form_view == "expanded")');
   d.writeln('   {');
   d.writeln('      window.top.gv.form_view = "compact";');
   d.writeln('   }');
   d.writeln('   else if (window.top.gv.form_view == "compact")');
   d.writeln('   {');
   d.writeln('      window.top.gv.form_view = "expanded";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (window.top.gv.mode == "summary_archive")');
   d.writeln('   {');
   d.writeln('      document.location.href = "fp_forms_"+window.top.gv.archive_year+".html";');
   d.writeln('   }');
   d.writeln('   else');
   d.writeln('   {');
   d.writeln('      document.location.href = "fp_regular_season_form.html";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('</'+'script>');
   d.writeln('');
   d.writeln('');
   d.writeln('<center>');
   d.writeln('');
   if ( (top.gv.mobile != true) || (navigator.platform == "iPad") )
   {
      d.writeln('<font style="font-family: Calibri; font-size: 16pt; font-weight: bold; padding: 10px">'+document_heading+'</font><p>');
      d.writeln('');
   }

   d.writeln('<form name="fp_results">');
   d.writeln('');

   d.writeln('<table align=center');
   d.writeln('       class="b3_border"');
   d.writeln('      border=0');
   d.writeln('     bgcolor=white');
   d.writeln(' cellpadding=2');
   d.writeln(' cellspacing=0');
   d.writeln('          id="season_summary">');
   d.writeln('');

   d.writeln('<tr align=center bgcolor='+color_column_header_1+' height=27px>');
   d.writeln('<td class="br2_bb2_border" colspan=3>');
   d.writeln('<font style="font-size: 13pt"><b>'+summary_title+'</b></font>');
   d.writeln('</td>');
   for (var player_index = 0; player_index < number_of_rs_players; player_index++)
   {
      if ((player_index + 1) == number_of_rs_players)
      {
         border_class_1 = "bb2_border";
      }
      else
      {
         border_class_1 = "br2_bb2_border";
      }

      d.writeln('<td class='+border_class_1+' colspan='+column_span+'><font style="font-size: 12pt"><b>'+rs_players[sort_index[player_index]]+'</b></font></td>');
   }
   d.writeln('</tr>');
   d.writeln('');

   d.writeln('<tr align=center bgcolor='+color_light_blue+' height=27px>');
   d.writeln('<td class="gr1_bb2_border"><font style="font-size: 10pt"><b>Week</b></font></td>');
   d.writeln('<td class="gr1_bb2_border"><font style="font-size: 10pt"><b>Games<br>Scheduled</b></font></td>');
   d.writeln('<td class="br2_bb2_border"><font style="font-size: 10pt"><b>Games<br>Played</b></font></td>');

   for (var i = 1; i <= number_of_rs_players; i++)
   {
      if (form_view == "expanded")
      {
         d.writeln('<td class="gr1_bb2_border"><font style="font-size: 10pt"><b>Rank</b></font></td>');
         d.writeln('<td class="gr1_bb2_border"><font style="font-size: 10pt"><b>Games<br>Won</b></font></td>');
      }
      if (i == number_of_rs_players)
      {
         border_class_1 = "bb2_border";
      }
      else
      {
         border_class_1 = "br2_bb2_border";
      }

      d.writeln('<td class='+border_class_1+'><font style="font-size: 10pt"><b>Score</b></font></td>');
   }
   d.writeln('</tr>');
   d.writeln('');

   for (var week_index = 0; week_index < number_of_rs_weeks; week_index++)
   {
      weekly_picks = all_picks[week_index];

      if (week_index == (number_of_rs_weeks-1))
      {
         border_class_1 = "gr1_bb2_border";
         border_class_2 = "br2_bb2_border";
      }
      else
      {
         border_class_1 = "gr1_gb1_border";
         border_class_2 = "br2_gb1_border";
      }

      d.writeln('<tr align=center height=18px>');
      d.writeln('<td class='+border_class_1+'><font style="font-size: 11pt"><b>'+(week_index+1)+'</b></font></td>');
      d.writeln('<td class='+border_class_1+'><font style="font-size: 11pt">'+window.top.gv.all_home_teams[week_index].length+'</font></td>');

      if (week_index < week)
      {
         d.writeln('<td class='+border_class_2+'><font style="font-size: 11pt">'+window.top.gv.all_home_teams[week_index].length+'</font></td>');

         total_games_played = total_games_played + window.top.gv.all_home_teams[week_index].length;
      }
      else
      {
         d.writeln('<td class='+border_class_2+'><font style="font-size: 11pt"><br></font></td>');
      }

      for (var player_index = 0; player_index < number_of_rs_players; player_index++)
      {
         if (week_index == (number_of_rs_weeks-1))
         {
            if ((player_index + 1) == number_of_rs_players)
            {
               border_class_3 = "bb2_border";
            }
            else
            {
               border_class_3 = "br2_bb2_border";
            }
         }
         else
         {
            if ((player_index + 1) == number_of_rs_players)
            {
               border_class_3 = "gb1_border";
            }
            else
            {
               border_class_3 = "br2_gb1_border";
            }
         }

         if (week_index < week)
         {
            weekly_max_games_won = 0;
            weekly_max_score     = 0;

            for (var player_index2 = 0; player_index2 < number_of_rs_players; player_index2++)
            {
               // JL Move these above?
               weekly_max_games_won = Math.max(weekly_max_games_won,all_games_won[week_index][player_index2]);
               weekly_max_score     = Math.max(weekly_max_score,all_scores[week_index][player_index2]);
            }

            if (form_view == "expanded")
            {
               if (all_ranks[week_index][sort_index[player_index]] == 1)
               {
                  bold_end      = "</B>";
                  bold_start    = "<B>";
                  font_color    = "color=" + color_blue;
                  td_background = "bgcolor=" + color_light_blue;
               }
               else
               {
                  bold_end      = "";
                  bold_start    = "";
                  font_color    = "";
                  td_background = "";
               }

               if (weekly_picks[sort_index[player_index]].length > 0)
               {
                  d.writeln('<td '+td_background+' class='+border_class_1+'><font style="font-size: 11pt" '+font_color+'>'+bold_start+all_ranks[week_index][sort_index[player_index]]+bold_end+'</font></td>');
               }
               else
               {
                  d.writeln('<td class='+border_class_1+'><font style="font-size: 11pt"><br></font></td>');
               }

               if (all_games_won[week_index][sort_index[player_index]] == weekly_max_games_won)
               {
                  bold_end      = "";
                  bold_start    = "";
                  td_background = "bgcolor=" + color_light_blue;

                  // Make the background color teal if the player had a perfect week and picked all games correctly.

                  if (all_games_won[week_index][sort_index[player_index]] == window.top.gv.all_home_teams[week_index].length)
                  {
                     td_background = "bgcolor=" + color_teal;
                  }
               }
               else
               {
                  bold_end      = "";
                  bold_start    = "";
                  td_background = "";
               }

               d.writeln('<td '+td_background+' class='+border_class_1+'><font style="font-size: 11pt">'+bold_start+all_games_won[week_index][sort_index[player_index]]+bold_end+'</font></td>');
            }

            if (all_scores[week_index][sort_index[player_index]] == weekly_max_score)
            {
               bold_end      = "";
               bold_start    = "";
               td_background = "bgcolor=" + color_light_blue;
            }
            else if (all_scores[week_index][sort_index[player_index]] == player_low_scores[sort_index[player_index]])
            {
               bold_end      = "";
               bold_start    = "";
               td_background = "bgcolor=" + color_light_yellow;

               // Do this so that we only change the background color on the first occurrence of the low score.

               player_low_scores[sort_index[player_index]] = 999;
            }
            else
            {
               bold_end      = "";
               bold_start    = "";
               td_background = "";
            }

            d.writeln('<td '+td_background+' class='+border_class_3+'><font style="font-size: 11pt">'+bold_start+all_scores[week_index][sort_index[player_index]]+bold_end+'</font></td>');  
         }
         else
         {
            if (form_view == "expanded")
            {
               d.writeln('<td class='+border_class_1+'><font style="font-size: 11pt"><br></font></td>');
               d.writeln('<td class='+border_class_1+'><font style="font-size: 11pt"><br></font></td>');
            }

            d.writeln('<td class='+border_class_3+'><font style="font-size: 11pt"><br></font></td>');
         }
      }

      d.writeln('</tr>');  
      d.writeln('');    
   }

   d.writeln('<tr align=center height=18px>');
   d.writeln('<td class="gb1_border" align=center nowrap><font style="font-size: 11pt"><b><br></b></font></td>');
   d.writeln('<td class="gr1_gb1_border" align=right  nowrap><font style="font-size: 11pt"><b>Totals:&nbsp;&nbsp;</b></font></td>');
   d.writeln('<td class="br2_gb1_border" align=center nowrap><font style="font-size: 11pt">'+total_games_played+'</font></td>');

   for (var player_index = 0; player_index < number_of_rs_players; player_index++)
   {
      if ((player_index + 1) == number_of_rs_players)
      {
         border_class_1 = "gb1_border";
      }
      else
      {
         border_class_1 = "br2_gb1_border";
      }

      if (form_view == "expanded")
      {
         bold_end      = "";
         bold_start    = "";
         font_color    = "black";
         td_background = "";

         if (total_ranks[sort_index[player_index]] == 1)
         {
            bold_end      = "</b>";
            bold_start    = "<b>";
            font_color    = "color=" + color_blue;
            td_background = "bgcolor=" + color_light_blue;
         }

         d.writeln('<td '+td_background+' class="gr1_gb1_border"><font style="font-size: 11pt" '+font_color+'>'+bold_start+total_ranks[sort_index[player_index]]+bold_end+'</font></td>');

         bold_end      = "";
         bold_start    = "";
         td_background = "";

         player_total_games_won = total_games_won[sort_index[player_index]];

         if (player_total_games_won == best_total_games_won)
         {
            bold_end      = "</b>";
            bold_start    = "<b>";
            td_background = "bgcolor=" + color_light_blue;
         }

         d.writeln('<td '+td_background+' class="gr1_gb1_border"><font style="font-size: 11pt">'+bold_start+player_total_games_won+bold_end+'</font></td>');
      }

      bold_end      = "";
      bold_start    = "";
      td_background = "";

      player_total_score = total_scores[sort_index[player_index]];

      if (player_total_score == best_total_scores)
      {
         bold_end      = "</b>";
         bold_start    = "<b>";
         td_background = "bgcolor=" + color_light_blue;
      }

      d.writeln('<td '+td_background+' class='+border_class_1+'><font style="font-size: 11pt">'+bold_start+player_total_score+bold_end+'</font></td>');
   }
   d.writeln('</tr>');
   d.writeln('');

   d.writeln('<tr align=center height=18px>');
   d.writeln('<td class="bb2_border" align=center nowrap><font style="font-size: 11pt"><b><br></b></font></td>');
   d.writeln('<td class="br2_bb2_border" align=right colspan=2 nowrap><font style="font-size: 11pt"><b>Averages:&nbsp;&nbsp;</b></font></td>');

   for (var player_index = 0; player_index < number_of_rs_players; player_index++)
   {
      if ((player_index + 1) == number_of_rs_players)
      {
         border_class_1 = "bb2_border";
      }
      else
      {
         border_class_1 = "br2_bb2_border";
      }

      if (form_view == "expanded")
      {
         bold_end      = "";
         bold_start    = "";
         td_background = "";

         player_total_average_rank = total_average_ranks[sort_index[player_index]];

         if (player_total_average_rank == best_total_average_ranks)
         {
            bold_end      = "</b>";
            bold_start    = "<b>";
            td_background = "bgcolor=" + color_light_blue;
         }

         if (player_total_average_rank != "<br>")
         {
            player_total_average_rank = normalize_float_value(player_total_average_rank);
         }

         d.writeln('<td '+td_background+' class="gr1_bb2_border"><font style="font-size: 11pt">'+bold_start+player_total_average_rank+bold_end+'</font></td>');

         bold_end      = "";
         bold_start    = "";
         td_background = "";

         player_total_games_won = total_games_won[sort_index[player_index]];

         if (player_total_games_won == best_total_games_won)
         {
            bold_end      = "</b>";
            bold_start    = "<b>";
            td_background = "bgcolor=" + color_light_blue;
         }

         table_data = player_total_games_won / week;

         table_data = normalize_float_value(table_data);

         d.writeln('<td '+td_background+' class="gr1_bb2_border"><font style="font-size: 11pt">'+bold_start+table_data+bold_end+'</font></td>');
      }

      bold_end      = "";
      bold_start    = "";
      td_background = "";

      player_total_score = total_scores[sort_index[player_index]];

      if (player_total_score == best_total_scores)
      {
         bold_end      = "</b>";
         bold_start    = "<b>";
         td_background = "bgcolor=" + color_light_blue;
      }

      if (week > 1)
      {
         // The low score has not been subtracted from the total score yet.

         table_data = player_total_score / (week - 1);
      }
      else
      {
         table_data = player_total_score / week;
      }

      table_data = normalize_float_value(table_data);

      d.writeln('<td '+td_background+' class='+border_class_1+'><font style="font-size: 11pt">'+bold_start+table_data+bold_end+'</b></font></td>');
   }
   d.writeln('</tr>');
   d.writeln('');

   d.writeln('<tr align=right height=15px>');
   d.writeln('<td class="br2_gb1_border" colspan=3><font style="font-size: 10pt">1st place count =&nbsp;</font></td>');
   for (var player_index = 0; player_index < number_of_rs_players; player_index++)
   {
      if ((player_index + 1) == number_of_rs_players)
      {
         border_class_1 = "gb1_border";
         border_class_2 = "gb1_border";
      }
      else
      {
         border_class_1 = "br2_gb1_border";
         border_class_2 = "br2_gb1_border";
      }

      if (form_view == "expanded")
      {
         border_class_1 = "gr1_gb1_border";
      }

      table_data = "<br>";

      if (total_1st_places[sort_index[player_index]] > 0) table_data = total_1st_places[sort_index[player_index]];

      if (table_data == max_1st_places)
      {
         bold_end   = "</b>";
         bold_start = "<b>";
         font_color = "color=" + color_green;
      }
      else
      {
         bold_end   = "";
         bold_start = "";
         font_color = "";
      }

      d.writeln('<td align=center class='+border_class_1+'><font style="font-size: 10pt" '+font_color+'>'+bold_start+table_data+bold_end+'</font></td>');

      if (form_view == "expanded")
      {
         d.writeln('<td><font style="font-size: 10pt"><br></font></td>');
         d.writeln('<td class='+border_class_2+'><font style="font-size: 10pt"><br></font></td>');
      }
   }
   d.writeln('</tr>');
   d.writeln('');

   d.writeln('<tr align=right height=15px>');
   d.writeln('<td class="br2_gb1_border" colspan=3><font style="font-size: 10pt">2nd place count =&nbsp;</font></td>');
   for (var player_index = 0; player_index < number_of_rs_players; player_index++)
   {
      if ((player_index + 1) == number_of_rs_players)
      {
         border_class_1 = "gb1_border";
         border_class_2 = "gb1_border";
      }
      else
      {
         border_class_1 = "br2_gb1_border";
         border_class_2 = "br2_gb1_border";
      }

      if (form_view == "expanded")
      {
         border_class_1 = "gr1_gb1_border";
      }

      table_data = "<br>";

      if (total_2nd_places[sort_index[player_index]] > 0) table_data = total_2nd_places[sort_index[player_index]];

      if (table_data == max_2nd_places)
      {
         bold_end   = "</b>";
         bold_start = "<b>";
         font_color = "color=" + color_green;
      }
      else
      {
         bold_end   = "";
         bold_start = "";
         font_color = "";
      }

      d.writeln('<td align=center class='+border_class_1+'><font style="font-size: 10pt" '+font_color+'>'+bold_start+table_data+bold_end+'</font></td>');

      if (form_view == "expanded")
      {
         d.writeln('<td><font style="font-size: 10pt"><br></font></td>');
         d.writeln('<td class='+border_class_2+'><font style="font-size: 10pt"><br></font></td>');
      }
   }
   d.writeln('</tr>');
   d.writeln('');

   d.writeln('<tr align=right height=15px>');
   d.writeln('<td class="br2_gb1_border" colspan=3><font style="font-size: 10pt">3rd place count =&nbsp;</font></td>');
   for (var player_index = 0; player_index < number_of_rs_players; player_index++)
   {
      if ((player_index + 1) == number_of_rs_players)
      {
         border_class_1 = "gb1_border";
         border_class_2 = "gb1_border";
      }
      else
      {
         border_class_1 = "br2_gb1_border";
         border_class_2 = "br2_gb1_border";
      }

      if (form_view == "expanded")
      {
         border_class_1 = "gr1_gb1_border";
      }

      table_data = "<br>";

      if (total_3rd_places[sort_index[player_index]] > 0) table_data = total_3rd_places[sort_index[player_index]];

      if (table_data == max_3rd_places)
      {
         bold_end   = "</b>";
         bold_start = "<b>";
         font_color = "color=" + color_green;
      }
      else
      {
         bold_end   = "";
         bold_start = "";
         font_color = "";
      }

      d.writeln('<td align=center class='+border_class_1+'><font style="font-size: 10pt" '+font_color+'>'+bold_start+table_data+bold_end+'</font></td>');

      if (form_view == "expanded")
      {
         d.writeln('<td><font style="font-size: 10pt"><br></font></td>');
         d.writeln('<td class='+border_class_2+'><font style="font-size: 10pt"><br></font></td>');
      }
   }
   d.writeln('</tr>');
   d.writeln('');

   d.writeln('<tr align=right height=15px>');
   d.writeln('<td class="br2_gb1_border" colspan=3><font style="font-size: 10pt">Last place count =&nbsp;</font></td>');
   for (var player_index = 0; player_index < number_of_rs_players; player_index++)
   {
      if ((player_index + 1) == number_of_rs_players)
      {
         border_class_1 = "gb1_border";
         border_class_2 = "gb1_border";
      }
      else
      {
         border_class_1 = "br2_gb1_border";
         border_class_2 = "br2_gb1_border";
      }

      if (form_view == "expanded")
      {
         border_class_1 = "gr1_gb1_border";
      }

      table_data = "<br>";

      if (total_last_places[sort_index[player_index]] > 0) table_data = total_last_places[sort_index[player_index]];

      if (table_data == max_last_places)
      {
         bold_end   = "</b>";
         bold_start = "<b>";
         font_color = "color=" + color_red;
      }
      else
      {
         bold_end   = "";
         bold_start = "";
         font_color = "";
      }

      d.writeln('<td align=center class='+border_class_1+'><font style="font-size: 10pt" '+font_color+'>'+bold_start+table_data+bold_end+'</font></td>');

      if (form_view == "expanded")
      {
         d.writeln('<td><font style="font-size: 10pt"><br></font></td>');
         d.writeln('<td class='+border_class_2+'><font style="font-size: 10pt"><br></font></td>');
      }
   }
   d.writeln('</tr>');
   d.writeln('');

   d.writeln('<tr align=right height=15px>');
   d.writeln('<td class="br2_border" colspan=3><font style="font-size: 10pt">Missed week count =&nbsp;</font></td>');
   for (var player_index = 0; player_index < number_of_rs_players; player_index++)
   {
      if ((player_index + 1) == number_of_rs_players)
      {
         border_class_1 = "no_border";
         border_class_2 = "no_border";
      }
      else
      {
         border_class_1 = "br2_border";
         border_class_2 = "br2_border";
      }

      if (form_view == "expanded")
      {
         border_class_1 = "gr1_border";
      }

      table_data = "<br>";

      if (total_missed_weeks[sort_index[player_index]] > 0) table_data = total_missed_weeks[sort_index[player_index]];

      if (table_data == max_missed_weeks)
      {
         bold_end   = "</b>";
         bold_start = "<b>";
         font_color = "color=" + color_red;
      }
      else
      {
         bold_end   = "";
         bold_start = "";
         font_color = "";
      }

      d.writeln('<td align=center class='+border_class_1+'><font style="font-size: 10pt" '+font_color+'>'+bold_start+table_data+bold_end+'</font></td>');

      if (form_view == "expanded")
      {
         d.writeln('<td class="gr1_border"><font style="font-size: 10pt"><br></font></td>');
         d.writeln('<td class='+border_class_2+'><font style="font-size: 10pt"><br></font></td>');
      }
   }
   d.writeln('</tr>');
   d.writeln('');

   d.writeln('</table>');
   d.writeln('');

   d.writeln('<table cols=1 align=center>');
   d.writeln('');

   d.writeln('<tr><td class="no_border" style="font-size: 2pt">&nbsp;</td></tr>');
   d.writeln('');

   d.writeln('<tr align=center>');
   d.writeln('<td nowrap class="no_border">');
   if (order_by == "players")
   {
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="order_by_button" value="Order By Score"');
   }
   else
   {
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="order_by_button" value="Order By Player"');
   }
   d.writeln('    onClick="change_order(document);return true;">');
   d.writeln('&nbsp;');
   if (form_view == "expanded")
   {
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="view_button" value="Hide Rank and Games Won"');
   }
   else
   {
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="view_button" value="Show Rank and Games Won"');
   }
   d.writeln('    onClick="change_view(document);return true;">');
   d.writeln('&nbsp;');
   d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="close_button" value="Close"');
   d.writeln('    onClick="javascript:window.top.close();">');
   d.writeln('</td>');
   d.writeln('</tr>');
   d.writeln('');

   d.writeln('</table>');
   d.writeln('');

   d.writeln('</form>');
   d.writeln('');

   d.writeln('</center>');
   d.writeln('');

   if (window.top.gv.mobile != true) d.writeln('<script>document.fp_results.view_button.focus();</'+'script>');
   d.writeln('');

   d.writeln('</body>');
   d.writeln('');

   d.writeln('</html>');

   adjust_mobile_viewport_height(d);

   if ( (top.gv.mobile == true) && (navigator.platform != "iPad") )
   {
      d.body.scrollLeft = 0;
      d.body.scrollTop  = 0;
   }
   else
   {
      d.getElementById("season_summary").scrollIntoView();
   }

   d.close();

   return true;
}


function calculate_games_won(picks,weights,winners,number_of_rs_games)
{
   var games_won = 0;

   // Calculate number of games won for the current week.

   if (picks.length > 0)
   {
      for (var game_index = 0; game_index < number_of_rs_games; game_index++)
      {
         if ( (winners[game_index] != "0") && (picks[game_index] == winners[game_index]) )
         {
            games_won++;
         }
      }
   }
   else
   {
      games_won = 0;
   }

   return games_won;
}


function calculate_score(picks,weights,winners,number_of_rs_games)
{
   var score = 0;

   // Calculate scores for the current week.

   if (picks.length > 0)
   {
      for (var game_index = 0; game_index < number_of_rs_games; game_index++)
      {
         if ( (winners[game_index] != "0") && (picks[game_index] == winners[game_index]) )
         {
            score = score + (weights[game_index]-0);
         }
      }
   }
   else
   {
      score = 0;
   }

   return score;
}


function check_for_opener()
{
   var undefined;

   if ( (!window.top.gv) || window.top.gv == null || window.top.gv == undefined)
   {
      alert("This page will only work if it is opened from the Football Pool 'Forms' page.\n" +
            "You will now be re-directed to the Football Pool home page.  Once you're\n" +
            "there, click on 'Forms', and then click on the desired 'On-Line' form link.");

      window.open("fp.html");

      return false;
   }

   return true;
}


function normalize_float_value(received_float_value)
{
   var float_value         = received_float_value;
   var float_value_integer = "";
   var float_value_decimal = "";


   float_value = " " + float_value;

   decimal_position = float_value.indexOf(".") - 1;

   if (decimal_position > 0)
   {
      float_value = float_value.slice(1,float_value.length+1) + "#";

      pound_position = float_value.indexOf("#");

      if (pound_position-decimal_position == 3)
      {
         float_value = float_value.slice(0,float_value.length-1);
      }
      else if (pound_position-decimal_position == 2)
      {
         float_value = float_value.slice(0,float_value.length-1) + "0";
      }
      else if (pound_position-decimal_position == 1)
      {
         float_value = float_value.slice(0,float_value.length-1) + "00";
      }
      else if (pound_position-decimal_position > 3)
      {
         if (float_value.slice(decimal_position+3,decimal_position+4) >= 5)
         {
            if (float_value.slice(decimal_position+1,decimal_position+3) == 99)
            {
               float_value = ((float_value.slice(0,decimal_position) - 0) + 1) + ".00";
            }
            else
            {
               // Save the integer part of the float value (including the decimal point).

               float_value_integer = float_value.slice(0,decimal_position+1);

               // Save the two-digit decimal part of the float value.

               float_value_decimal = ((float_value.slice(decimal_position+1,decimal_position+3) - 0) + 1);

               // If the two-digit decimal value is less than ten, avoid losing the leading "0".

               if (float_value_decimal < 10) float_value_decimal = "0" + float_value_decimal;

               // Put the integer and decimal parts of the float value together.

               float_value = float_value_integer + float_value_decimal;
            }
         }
         else
         {
            float_value = float_value.slice(0,decimal_position+3);
         }
      }
   }
   else
   {
      float_value = float_value + ".00";
   }

   return float_value;
}
