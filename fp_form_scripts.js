
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
   var document_heading              = "";
   var game_state                    = "at";
   var home_team_possession_flag     = "";
   var input_field_size              = 1;
   var input_tag_style               = "";
   var mode                          = window.top.gv.mode;
   var mode_string                   = "";
   var victors                       = "";
   var visiting_team_possession_flag = "";
   var week                          = window.top.gv.current_input_week - 17;

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

   // Force this week's visitor and home scores to be zero if the mode is preliminary.

   var number_of_games = 11;

   for (var gi = 1; gi <= number_of_games; gi++)
   {
      if ( ( (week == 1) && (mode == "prelim") && (gi >=  1 && gi <=  4) ) ||
           ( (week == 2) && (mode == "prelim") && (gi >=  5 && gi <=  8) ) ||
           ( (week == 3) && (mode == "prelim") && (gi >=  9 && gi <= 10) ) ||
           ( (week == 4) && (mode == "prelim") && (gi >= 11 && gi <= 11) )    )
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

   var adjusted_score            = 0;
   var best_player_win_count     = 0;
   var best_total_points_count   = 0;
   var best_total_points_score   = null_score;
   var border_style              = "no_border";
   var current_week_scores       = 0;
   var form_view                 = window.top.gv.form_view;
   var heading_colspan           = 53;
   var high_score_count          = 0;
   var high_score_players        = [null,null,null,null,null,null,null,null,null,null,null,null];
   var home_scores               = window.top.gv.home_scores;
   var null_score                = 9999;
   var number_of_ps_players      = window.top.gv.ps_players.length;
   var order_by                  = window.top.gv.order_by;
   var overall_ranks             = [1,1,1,1,1,1,1,1,1,1,1,1];
   var overall_scores            = [null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score];
   var percent_wins              = "";
   var player_colspan            = 4;
   var player_index              = [0,1,2,3,4,5,6,7,8,9,10,11];
   var player_pick_valid         = true;
   var player_win_count          = [0,0,0,0,0,0,0,0,0,0,0,0];
   var points                    = "";
   var possible_win_count        = 0;
   var ps_players                = window.top.gv.ps_players;
   var sorted_overall_scores     = [null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score];
   var sorted_week_1_scores      = [null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score];
   var sorted_week_2_scores      = [null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score];
   var sorted_week_3_scores      = [null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score];
   var sorted_week_4_scores      = [null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score];
   var td_background             = "";
   var total_points              = "";
   var total_points_game_index   = -1;
   var total_points_score        = "<br>";
   var total_points_scores       = [null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score];
   var use_player_points         = true;
   var visitor_scores            = window.top.gv.visitor_scores;
   var week_1_high_score_count   = 0;
   var week_1_high_score_players = [null,null,null,null,null,null,null,null,null,null,null,null];
   var week_1_ranks              = [1,1,1,1,1,1,1,1,1,1,1,1];
   var week_1_scores             = [null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score];
   var week_1_valid_game_cnt     = 4;
   var week_2_high_score_count   = 0;
   var week_2_high_score_players = [null,null,null,null,null,null,null,null,null,null,null,null];
   var week_2_ranks              = [1,1,1,1,1,1,1,1,1,1,1,1];
   var week_2_scores             = [null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score];
   var week_2_valid_game_cnt     = 4;
   var week_3_high_score_count   = 0;
   var week_3_high_score_players = [null,null,null,null,null,null,null,null,null,null,null,null];
   var week_3_ranks              = [1,1,1,1,1,1,1,1,1,1,1,1];
   var week_3_scores             = [null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score];
   var week_3_valid_game_cnt     = 2;
   var week_4_high_score_count   = 0;
   var week_4_high_score_players = [null,null,null,null,null,null,null,null,null,null,null,null];
   var week_4_ranks              = [1,1,1,1,1,1,1,1,1,1,1,1];
   var week_4_scores             = [null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score];
   var week_4_valid_game_cnt     = 1;

   // Only use player points as a tie breaker if the foolball pool year is 2011 or later.

   if (window.top.gv.archive_year != undefined && window.top.gv.archive_year < 2011) use_player_points = false;

   // Set column spans for expanded or compact view.

   if (form_view == "expanded")
   {
      heading_colspan = 53;
      player_colspan  = 4;
   }
   else
   {
      heading_colspan = 17;
      player_colspan  = 1;
   }

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

   for (var gi = 1; gi <= number_of_games; gi++)
   {
      // Force visiting team names, home team names, player picks,
      // players spreads, and player points to be blank for future weeks.

      if ( ( (week ==  1) && (gi >  4) ) ||
           ( (week ==  2) && (gi >  8) ) ||
           ( (week ==  3) && (gi > 10) ) ||
           ( (week ==  4) && (gi > 11) )    )
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

         if ( (gi >=  1) && (gi <=  4) ) week_1_valid_game_cnt--;
         if ( (gi >=  5) && (gi <=  8) ) week_2_valid_game_cnt--;
         if ( (gi >=  9) && (gi <= 10) ) week_3_valid_game_cnt--;
         if ( (gi >= 11) && (gi <= 11) ) week_4_valid_game_cnt--;
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

      for (var gi = 1; gi <= number_of_games; gi++)
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

         if (gi ==  4)
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

         if (gi ==  8)
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

         if (gi == 10)
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

         if (gi == 11)
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
            total_points_game_index = 4-1; // Game 4 of week 1.
         }

         if (post_season_week == 2)
         {
            high_score_count        = week_2_high_score_count;
            high_score_players      = week_2_high_score_players;
            total_points_game_index = 8-1; // Game 4 of week 2.
         }

         if (post_season_week == 3)
         {
            high_score_count        = week_3_high_score_count;
            high_score_players      = week_3_high_score_players;
            total_points_game_index = 10-1; // Game 2 of week 3.
         }

         if (post_season_week == 4)
         {
            high_score_count        = week_4_high_score_count;
            high_score_players      = week_4_high_score_players;
            total_points_game_index = 11-1; // Game 1 of week 4.
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

         total_points_scores = [null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score,null_score];
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
   d.writeln('   var error_message  = "Invalid input.\\n\\nPlease enter a number between 0 and 99 for the ";');
   d.writeln('   var select_element = "";');
   d.writeln('   var input_score    = 0;');
   d.writeln('   var scores         = document.fp_scores;');
   d.writeln('   var team           = "";');
   d.writeln('');
   d.writeln('');
   d.writeln('   clear_get_scores_data();  // Clear any teams previously identified as victors via "Get Scores".');
   d.writeln('');
   d.writeln('   for (var ei = 0; ei < scores.elements.length; ei++)');
   d.writeln('   {');
   d.writeln('      for (var gi = 1; gi <= '+number_of_games+'; gi++)');
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
   d.writeln('      document.location.href = "fp_post_season_form.html";');
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
   d.writeln('      document.location.href = "fp_post_season_form.html";');
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
   d.writeln('   // Clear any teams previously identified as victors via "Get Scores".');
   d.writeln('');
   d.writeln('   for (var i = 0; i < '+number_of_games+'; i++)');
   d.writeln('   {');
   d.writeln('      window.top.gv.post_season_victors[i] = "";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function get_nfl_scores(document,mode,command)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   var adjust_index                       = 0;');
   d.writeln('   var exit_loop                          = false;');
   d.writeln('   var game_info                          = "";');
   d.writeln('   var game_clock_integer                 = "";');
   d.writeln('   var game_clock_string                  = "";');
   d.writeln('   var game_state                         = "";');
   d.writeln('   var game_status                        = "game_not_started";');
   d.writeln('   var games_in_progress                  = false;');
   d.writeln('   var home_score                         = "";');
   d.writeln('   var home_team                          = "";');
   d.writeln('   var index                              = 0;');
   d.writeln('   var nfl_connection                     = null;');
   d.writeln('   var nfl_scores                         = null;');
   d.writeln('   var nfl_team_cities                    = ["ARI",      "ATL",    "BAL",   "BUF",  "CAR",     "CHI",  "CIN",    "CLE",   "DAL",    "DEN",    "DET",  "NYG",   "GB",     "HOU",   "IND",  "JAX",    "NYJ", "KC",    "MIA",     "MIN",    "NE",      "NO",    "OAK",    "PHI",   "PIT",     "SD",      "SF",   "SEA",     "LA", "TB",        "TEN",   "WAS"     ];');
   d.writeln('   var nfl_team_names                     = ["Cardinals","Falcons","Ravens","Bills","Panthers","Bears","Bengals","Browns","Cowboys","Broncos","Lions","Giants","Packers","Texans","Colts","Jaguars","Jets","Chiefs","Dolphins","Vikings","Patriots","Saints","Raiders","Eagles","Steelers","Chargers","49ers","Seahawks","Rams","Buccaneers","Titans","Redskins"];');
   d.writeln('   var number_of_games                    = '+number_of_games+' + 1;');  // Add 1 to account for the Pro Bowl
   d.writeln('   var nfl_games_array                    = new Array(number_of_games);');
   d.writeln('   var possession_team                    = "";');
   d.writeln('   var post_season_possession_teams_index = 0;');
   d.writeln('   var post_season_victors_index          = 0;');
   d.writeln('   var scores_index_start                 = null;');
   d.writeln('   var scores_index_stop                  = null;');
   d.writeln('   var temp_array                         = "";');
   d.writeln('   var user_message                       = "";');
   d.writeln('   var visiting_score                     = "";');
   d.writeln('   var visiting_team                      = "";');
   d.writeln('   var week                               = window.top.gv.current_input_week-18;');
   d.writeln('');
   d.writeln('');
   d.writeln('   if (command != "Start")');
   d.writeln('   {');
   d.writeln('      command = "Get Scores";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (week == 1)');
   d.writeln('   {');
   d.writeln('      scores_index_start = 0;');
   d.writeln('      scores_index_stop  = 3;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (week == 2)');
   d.writeln('   {');
   d.writeln('      scores_index_start = 4;');
   d.writeln('      scores_index_stop  = 7;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (week == 3)');
   d.writeln('   {');
   d.writeln('      scores_index_start = 8;');
   d.writeln('      scores_index_stop  = 9;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (week == 4)');
   d.writeln('   {');
   d.writeln('      scores_index_start = 10;');
   d.writeln('      scores_index_stop  = 10;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   clear_get_scores_data();');
   d.writeln('');
   d.writeln('   // Attempt to get the NFL scores from the internet.');
   d.writeln('');
   d.writeln('   nfl_connection = new XMLHttpRequest();');
   d.writeln('');
   d.writeln('   try');
   d.writeln('   {');
   d.writeln('      nfl_connection.open("GET",encodeURI("https://query.yahooapis.com/v1/public/yql?q=select * from xml where url=\\"http://www.nfl.com/liveupdate/scorestrip/postseason/ss.xml\\""),false);');
   d.writeln('      nfl_connection.send(null);');
   d.writeln('');
   d.writeln('      if (nfl_connection.readyState == 4)');
   d.writeln('      {');
   d.writeln('         nfl_scores = nfl_connection.responseText;');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('   catch(e)');
   d.writeln('   {');
   d.writeln('      user_message = "\\"Get Scores\\" failed for some unknown reason.";');
   d.writeln('');
   d.writeln('      alert(user_message);');
   d.writeln('');
   d.writeln('      // Force auto refresh to be off if there is an error when attempting to get the NFL scores.');
   d.writeln('');
   d.writeln('      window.top.gv.get_scores_state = "off";');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (mode == "manual")');
   d.writeln('   {');
   d.writeln('      user_message = "\\""+ command + "\\" will do the following:\\n\\n";');
   d.writeln('      user_message = user_message + "   - Clear the scores on the Preliminary Form\\n";');
   d.writeln('      user_message = user_message + "   - Get all in-progress and final scores from the internet\\n";');
   d.writeln('      user_message = user_message + "   - Populate the Preliminary Form based on the scores from the internet\\n";');
   d.writeln('      if (command == "Start")');
   d.writeln('      {');
   d.writeln('         user_message = user_message + "   - Automatically update the Preliminary Form every 15 seconds\\n";');
   d.writeln('      }');
   d.writeln('      user_message = user_message + "   \\n\\nNOTE:  Scores with blue backgrounds indicate completed games.\\n\\n";');
   d.writeln('');
   d.writeln('      if (confirm(user_message) == false) return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Strip off all characters that preceed the first game in nfl_scores.');
   d.writeln('');
   d.writeln('   index = nfl_scores.indexOf("<g ");');
   d.writeln('');
   d.writeln('   if (index > -1)');
   d.writeln('   {');
   d.writeln('      nfl_scores = nfl_scores.substring(index);');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Extract each game out of nfl_scores and put them into the nfl_games_array.');
   d.writeln('');
   d.writeln('   for (var i = 0; i < number_of_games; i++)');
   d.writeln('   {');
   d.writeln('      // Replace the first occurrence of "<g " with "Xg " in nfl_scores in order to cause');
   d.writeln('      // the upcoming "nfl_scores.indexOf" call to skip over the first game in nfl_scores.');
   d.writeln('');
   d.writeln('      nfl_scores = "X" + nfl_scores.substring(1);');
   d.writeln('');
   d.writeln('      // Find the beginning of the second game in nfl_scores (which is where the end of the first game is).');
   d.writeln('');
   d.writeln('      index = nfl_scores.indexOf("<g ");');
   d.writeln('');
   d.writeln('      if (index > -1)');
   d.writeln('      {');
   d.writeln('         // Assign the first game in nfl_scores to the nfl_games_array.');
   d.writeln('');
   d.writeln('         nfl_games_array[i] = nfl_scores.substring(0,index);');
   d.writeln('');
   d.writeln('         // Strip off the first game in nfl_scores since we safely saved it in the nfl_games_array.');
   d.writeln('');
   d.writeln('         nfl_scores = nfl_scores.substring(index);');
   d.writeln('      }');
   d.writeln('      else');
   d.writeln('      {');
   d.writeln('         // This handles the last game which is all by itself at this point in nfl_scores.');
   d.writeln('');
   d.writeln('         nfl_games_array[i] = nfl_scores;');
   d.writeln('');
   d.writeln('         // Get out of this loop because there are no more games in nfl_scores.');
   d.writeln('');
   d.writeln('         exit_loop = true;');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      // Strip off unnecessary characters from the beginning of the current nfl_games_array game.');
   d.writeln('');
   d.writeln('      index = nfl_games_array[i].indexOf("hnn");');
   d.writeln('');
   d.writeln('      nfl_games_array[i] = nfl_games_array[i].substring(index);');
   d.writeln('');
   d.writeln('      // Strip off unnecessary characters from the end of the current nfl_games_array game.');
   d.writeln('');
   d.writeln('      index = nfl_games_array[i].indexOf("/>");');
   d.writeln('');
   d.writeln('      nfl_games_array[i] = nfl_games_array[i].substring(0,index);');
   d.writeln('');
   d.writeln('      // Delete visitor team name (vtn) information from the current nfl_games_array game.');
   d.writeln('');
   d.writeln('      index = nfl_games_array[i].indexOf("vtn");');
   d.writeln('');
   d.writeln('      if (index > -1)');
   d.writeln('      {');
   d.writeln('         temp_array = nfl_games_array[i].substring(index)');
   d.writeln('         temp_array = temp_array.replace(/"/,"quote");');
   d.writeln('');
   d.writeln('         index = temp_array.indexOf("\\"")');
   d.writeln('');
   d.writeln('         if (index > -1)');
   d.writeln('         {');
   d.writeln('            temp_array = temp_array.substring(0,index+1)');
   d.writeln('            temp_array = temp_array.replace(/quote/,"\\"");');
   d.writeln('');
   d.writeln('            nfl_games_array[i] = nfl_games_array[i].replace(temp_array,"");');
   d.writeln('         }');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      // Delete home team name (htn) information from the current nfl_games_array game.');
   d.writeln('');
   d.writeln('      index = nfl_games_array[i].indexOf("htn");');
   d.writeln('');
   d.writeln('      if (index > -1)');
   d.writeln('      {');
   d.writeln('         temp_array = nfl_games_array[i].substring(index)');
   d.writeln('         temp_array = temp_array.replace(/"/,"quote");');
   d.writeln('');
   d.writeln('         index = temp_array.indexOf("\\"")');
   d.writeln('');
   d.writeln('         if (index > -1)');
   d.writeln('         {');
   d.writeln('            temp_array = temp_array.substring(0,index+1)');
   d.writeln('            temp_array = temp_array.replace(/quote/,"\\"");');
   d.writeln('');
   d.writeln('            nfl_games_array[i] = nfl_games_array[i].replace(temp_array,"");');
   d.writeln('         }');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      // Delete other unnecessary characters from the current nfl_games_array game.');
   d.writeln('');
   d.writeln('      nfl_games_array[i] = nfl_games_array[i].replace(/"/g,"");');
   d.writeln('      nfl_games_array[i] = nfl_games_array[i].replace(/hnn=/g,"");');
   d.writeln('      nfl_games_array[i] = nfl_games_array[i].replace(/hs=/g,"");');
   d.writeln('      nfl_games_array[i] = nfl_games_array[i].replace(/vnn=/g,"");');
   d.writeln('      nfl_games_array[i] = nfl_games_array[i].replace(/vs=/g,"");');
   d.writeln('');
   d.writeln('      if (exit_loop == true) break;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Perform some more processing against each game within the nfl_games_array.');
   d.writeln('');
   d.writeln('   for (var i = 0; i < number_of_games; i++)');
   d.writeln('   {');
   d.writeln('      // Determine the status and state of the current nfl_games_array game.');
   d.writeln('');
   d.writeln('      if (nfl_games_array[i].indexOf("q=P") > -1)');
   d.writeln('      {');
   d.writeln('         game_status = "game_not_started";');
   d.writeln('      }');
   d.writeln('      else if (nfl_games_array[i].indexOf("q=F") > -1)');
   d.writeln('      {');
   d.writeln('         game_status = "game_over";');
   d.writeln('         game_state  = "<font size=-1>F</font>";');
   d.writeln('      }');
   d.writeln('      else');
   d.writeln('      {');
   d.writeln('         game_status       = "game_in_progress";');
   d.writeln('         game_clock_string = "";');
   d.writeln('');
   d.writeln('         // Set the game state to the game quarter, halftime, or overtime.');
   d.writeln('');
   d.writeln('         game_state = nfl_games_array[i].substring(nfl_games_array[i].indexOf("q=")+2,nfl_games_array[i].indexOf("q=")+3);');
   d.writeln('');
   d.writeln('         if ( (game_state > 0) && (game_state < 5) ) game_state = game_state + "Q";');
   d.writeln('');
   d.writeln('         if (game_state == "O") game_state = "OT";');
   d.writeln('');
   d.writeln('         // Set the game clock string if it exists.');
   d.writeln('');
   d.writeln('         if (nfl_games_array[i].indexOf("k=") > -1)');
   d.writeln('         {');
   d.writeln('            game_clock_string = nfl_games_array[i].substring(nfl_games_array[i].indexOf("k=")+2,nfl_games_array[i].indexOf("k=")+7);');
   d.writeln('         }');
   d.writeln('');
   d.writeln('         // Determine if there are two minutes or less to play in the 2nd quarter, 4th quarter, or overtime.');
   d.writeln('');
   d.writeln('         if ( (game_state.substring(0,2) == "2Q") || (game_state.substring(0,2) == "4Q") || (game_state.substring(0,2) == "OT") )');
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
   d.writeln('         // If the game clock exists, add it to the game state.');
   d.writeln('');
   d.writeln('         if (game_clock_string != "") game_state = game_state + " " + game_clock_string;');
   d.writeln('');
   d.writeln('         // Reduce the font size of the game state and save if for later assignment to window.top.gv.post_season_game_states.');
   d.writeln('');
   d.writeln('         game_state = "<font size=-1>"+game_state+"</font>";');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      // Split the nfl_games_array game into multiple parts so that the game information can easily be extracted.');
   d.writeln('');
   d.writeln('      game_info = nfl_games_array[i].split(" ",20);');  // Splitting into 20 parts is more than is needed but is safe.');
   d.writeln('');
   d.writeln('      // Reset the adjust_index value.');
   d.writeln('');
   d.writeln('      adjust_index = 0;');
   d.writeln('');
   d.writeln('      // Determine if the nfl_games_array game includes the game clock and if so account for it later when getting data out of game_info.');
   d.writeln('');
   d.writeln('      if (nfl_games_array[i].indexOf("k=") > -1) adjust_index++;');
   d.writeln('');
   d.writeln('      // Determine if the nfl_games_array game includes the possession and if so account for it later when getting data out of game_info.');
   d.writeln('');
   d.writeln('      // Also, remember which team actually has possession of the ball and if they are in the red zone.');
   d.writeln('');
   d.writeln('      if (nfl_games_array[i].indexOf("p=") > -1)');
   d.writeln('      {');
   d.writeln('         adjust_index++;');
   d.writeln('');
   d.writeln('         for (var j = 0; j < game_info.length; j++)');
   d.writeln('         {');
   d.writeln('            if (game_info[j].substring(0,2) == "p=")');
   d.writeln('            {');
   d.writeln('               // Remember which team has possession of the ball.');
   d.writeln('');
   d.writeln('               possession_team = game_info[j].slice(2);');
   d.writeln('');
   d.writeln('               // Determine the actual name of the team with possession of the ball from its abbreviated city name and save it.');
   d.writeln('')
   d.writeln('               for (var k = 0; k < nfl_team_cities.length; k++)');
   d.writeln('               {');
   d.writeln('                  if (possession_team == nfl_team_cities[k])');
   d.writeln('                  {');
   d.writeln('                     window.top.gv.post_season_possession_teams[post_season_possession_teams_index] = nfl_team_names[k];');
   d.writeln('');
   d.writeln('                     // Determine if the team with possession of the ball is in the red zone, and if so, remember it.');
   d.writeln('')
   d.writeln('                     if (nfl_games_array[i].indexOf("rz=1") > -1)');
   d.writeln('                     {');
   d.writeln('                        window.top.gv.post_season_red_zone_flags[post_season_possession_teams_index] = true;');
   d.writeln('                     }');
   d.writeln('');
   d.writeln('                     post_season_possession_teams_index++;');
   d.writeln('                  }');
   d.writeln('               }');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      // Extract the teams and their scores from the game_info.');
   d.writeln('');
   d.writeln('      visiting_team  = game_info[9+adjust_index];');
   d.writeln('      visiting_team  = visiting_team.charAt(0).toUpperCase() + visiting_team.slice(1);');
   d.writeln('      visiting_score = parseInt(game_info[10+adjust_index]);');
   d.writeln('');
   d.writeln('      home_team  = game_info[0];');
   d.writeln('      home_team  = home_team.charAt(0).toUpperCase() + home_team.slice(1);');
   d.writeln('      home_score = parseInt(game_info[1]);');
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
   d.writeln('               window.top.gv.visitor_scores[j] = visiting_score;');
   d.writeln('               window.top.gv.home_scores[j]    = home_score;');
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
   d.writeln('');
   d.writeln('            window.top.gv.post_season_game_states[j] = game_state;');
   d.writeln('         }');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (games_in_progress == false)');
   d.writeln('   {');
   d.writeln('      if (mode == "manual")');
   d.writeln('      {');
   d.writeln('         alert("There are no Post Season Week " + week + " games in progress yet.");');
   d.writeln('      }');
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
   d.writeln('function reset_scores(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   clear_get_scores_data();  // Clear any teams previously identified as victors via "Get Scores".');
   d.writeln('');
   d.writeln('   window.top.gv.scores_already_assigned = false;');
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
   if (top.gv.mobile == false)
   {
      d.writeln('<font style="font-family: Calibri; font-size: 16pt; font-weight: bold; color: maroon; padding: 10px">'+document_heading+'</font><p>');
      d.writeln('');
   }

   d.writeln('<form name="fp_scores">');
   d.writeln('');

   d.writeln('<table   align=center');
   d.writeln('         class="b3_border"');
   d.writeln('        border=0');
   d.writeln('       bgcolor=white');
   d.writeln('   cellpadding=2');
   d.writeln('   cellspacing=0>');
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

   for (var gi = 1; gi <= number_of_games; gi++)
   {
      if ( (gi == 1) || (gi == 5) || (gi == 9) || (gi == 11) )
      {
         d.writeln('');
         d.writeln('<tr height=8px>');
         d.writeln('<td class="bb2_border" colspan='+(5+player_colspan*12)+'></td>');
         d.writeln('</tr>');
         d.writeln('');
         d.writeln('<tr align=center bgcolor=#DCE6F1 height=18px>');

         if (gi == 1)
         {
            d.writeln('<td nowrap class="br2_bb2_border" colspan=5><font style="font-size: 11pt"><b>Wild Card Weekend</b></font></td>');
         }
         else if (gi == 5)
         {
            d.writeln('<td nowrap class="br2_bb2_border" colspan=5><font style="font-size: 11pt"><b>Divisional Playoffs</b></font></td>');
         }
         else if (gi == 9)
         {
            d.writeln('<td nowrap class="br2_bb2_border" colspan=5><font style="font-size: 11pt"><b>Conference Championships</b></font></td>');
         }
         else if (gi == 11)
         {
            d.writeln('<td nowrap class="br2_bb2_border" colspan=5><font style="font-size: 11pt"><b>Super Bowl</b></font></td>');
         }

         for (var pi = 1; pi <= number_of_ps_players; pi++)
         {
            if (form_view == "expanded")
            {
               d.writeln('<td class="gr1_bb2_border" colspan=3><font style="font-size: 10pt"><b>Prediction</b></font></td>');
            }
            if (pi == number_of_ps_players)
            {
               d.writeln('<td class="bb2_border"><font style="font-size: 10pt" color=blue><b>Score</b></font></td>');
            }
            else
            {
               d.writeln('<td class="br2_bb2_border"><font style="font-size: 10pt" color=blue><b>Score</b></font></td>');
            }
         }
         d.writeln('</tr>');
      }

      d.writeln('');
      d.writeln('<tr align=center height=15px>');

      border_style = "gr1_gb1_border";

      if (use_player_points == false) border_style = "gr1_bb1_border";

      if ( ( (mode == "prelim") && (week == 1) && (gi>=1  && gi<=4 ) ) ||
           ( (mode == "prelim") && (week == 2) && (gi>=5  && gi<=8 ) ) ||
           ( (mode == "prelim") && (week == 3) && (gi>=9  && gi<=10) ) ||
           ( (mode == "prelim") && (week == 4) && (gi>=11 && gi<=11) )    )
      {
         for (var j = 1; j <= number_of_games; j++)
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

         for (var j = 1; j <= number_of_games; j++)
         {
            if (post_season_possession_teams[j-1] == visiting_teams[gi-1])
            {
               // Set the visiting team possession flag.

               if (post_season_red_zone_flags[j-1] == true) bullet_color = color_red;

               visiting_team_possession_flag = "<span style='font-weight:bold; color:"+bullet_color+"'>\u2022&nbsp;</span>";

               // Reset possession team and red zone flag.

               post_season_possession_teams[j-1] = "";
               post_season_red_zone_flags[j-1]   = false;

               break;
            }
            else if (post_season_possession_teams[j-1] == home_teams[gi-1])
            {
               // Set the home team possession flag.

               if (post_season_red_zone_flags[j-1] == true) bullet_color = color_red;

               home_team_possession_flag = "<span style='font-weight:bold; color:"+bullet_color+"'>\u2022&nbsp;</span>";

               // Reset possession team and red zone flag.

               post_season_possession_teams[j-1] = "";
               post_season_red_zone_flags[j-1]   = false;

               break;
            }
         }

         // Set the game state flag (quarter, halftime, or overtime) if the game is in progress.

         game_state = window.top.gv.post_season_game_states[gi-1];

         // Reset the game state flag.

         window.top.gv.post_season_game_states[gi-1] = "at";

         if ( (gi == 4) || (gi == 8) || (gi == 10) || (gi == 11) )
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

         if ( (gi == 4) || (gi == 8) || (gi == 10) || (gi == 11) )
         {
            d.writeln('<td style="padding:2px 4px 2px 4px" class="'+border_style+'"><font style="font-size: 10pt">'+visitor_scores[gi-1]+'</font></td>');
         }
         else
         {
            d.writeln('<td style="padding:2px 4px 2px 4px" class="gr1_border"><font style="font-size: 10pt" >'+visitor_scores[gi-1]+'</font></td>');
         }
      }

      border_style = "gb1_border";

      if (use_player_points == false) border_style = "bb1_border";

      if (post_season_winners[gi-1] == "V")
      {
         if ( (gi == 4) || (gi == 8) || (gi == 10) || (gi == 11) )
         {
            d.writeln('<td class="'+border_style+'"><font style="font-size: 10pt; color: blue">'+visiting_team_possession_flag+visiting_teams[gi-1]+'</font></td>');
         }
         else
         {
            d.writeln('<td><font style="font-size: 10pt; color: blue" >'+visiting_team_possession_flag+visiting_teams[gi-1]+'</font></td>');
         }
      }
      else
      {
         if ( (gi == 4) || (gi == 8) || (gi == 10) || (gi == 11) )
         {
            d.writeln('<td class="'+border_style+'"><font style="font-size: 10pt">'+visiting_team_possession_flag+visiting_teams[gi-1]+'</font></td>');
         }
         else
         {
            d.writeln('<td><font style="font-size: 10pt">'+visiting_team_possession_flag+visiting_teams[gi-1]+'</font></td>');
         }
      }

      if ( (gi == 4) || (gi == 8) || (gi == 10) || (gi == 11) )
      {
         border_style = "gb1_border";

         if (use_player_points == false) border_style = "bb1_border";

         d.writeln('<td nowrap class="'+border_style+'"><font style="font-size: 10pt">'+game_state+'</font></td>');
      }
      else
      {
         d.writeln('<td nowrap><font style="font-size: 10pt">'+game_state+'</font></td>');
      }

      border_style = "gr1_gb1_border";

      if (use_player_points == false) border_style = "gr1_bb1_border";

      if (post_season_winners[gi-1] == "H")
      {
         if ( (gi == 4) || (gi == 8) || (gi == 10) || (gi == 11) )
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
         if ( (gi == 4) || (gi == 8) || (gi == 10) || (gi == 11) )
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

      if ( ( (mode == "prelim") && (week == 1) && (gi>=1  && gi<=4 ) ) ||
           ( (mode == "prelim") && (week == 2) && (gi>=5  && gi<=8 ) ) ||
           ( (mode == "prelim") && (week == 3) && (gi>=9  && gi<=10) ) ||
           ( (mode == "prelim") && (week == 4) && (gi>=11 && gi<=11) )    )
      {
         if ( (gi == 4) || (gi == 8) || (gi == 10) || (gi == 11) )
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
         if ( (gi == 4) || (gi == 8) || (gi == 10) || (gi == 11) )
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
         var start_bold = "";
         var end_bold   = "";

         if (player_picks[player_index[pi-1]][gi-1] == post_season_winners[gi-1])
         {
            start_bold = "";
            end_bold   = "";
         }
         if (form_view == "expanded")
         {
            if ( (gi == 4) || (gi == 8) || (gi == 10) || (gi == 11) )             
            {
               border_style = "gb1_border";

               if (use_player_points == false) border_style = "bb1_border";

               d.writeln('<td class="'+border_style+'"><font style="font-size: 10pt">'+start_bold+player_picks[player_index[pi-1]][gi-1]+end_bold+'</font></td>');
               d.writeln('<td class="'+border_style+'"><font style="font-size: 10pt">by</font></td>');

               border_style = "gr1_gb1_border";

               if (use_player_points == false) border_style = "gr1_bb1_border";

               d.writeln('<td class="'+border_style+'"><font style="font-size: 10pt">'+player_spreads[player_index[pi-1]][gi-1]+'</font></td>');
            }
            else
            {
               d.writeln('<td><font style="font-size: 10pt">'+start_bold+player_picks[player_index[pi-1]][gi-1]+end_bold+'</font></td>');
               d.writeln('<td><font style="font-size: 10pt">by</font></td>');  
               d.writeln('<td class="gr1_border"><font style="font-size: 10pt">'+player_spreads[player_index[pi-1]][gi-1]+'</font></td>');
            } 
         }

         if (pi == number_of_ps_players)
         {
            if ( (gi == 4) || (gi == 8) || (gi == 10) || (gi == 11) )
            {
               border_style = "gb1_border";

               if (use_player_points == false) border_style = "bb1_border";

               d.writeln('<td class="'+border_style+'"><font style="font-size: 10pt" color=blue>'+player_scores[player_index[pi-1]][gi-1]+'</font></td>');
            }
            else
            {
               d.writeln('<td><font style="font-size: 10pt" color=blue>'+player_scores[player_index[pi-1]][gi-1]+'</font></td>');
            }
         }
         else
         {
            if ( (gi == 4) || (gi == 8) || (gi == 10) || (gi == 11) )
            {
               border_style = "br2_gb1_border";

               if (use_player_points == false) border_style = "br2_bb1_border";

               d.writeln('<td class="'+border_style+'"><font style="font-size: 10pt" color=blue>'+player_scores[player_index[pi-1]][gi-1]+'</font></td>');
            }
            else
            {
               d.writeln('<td class="br2_border"><font style="font-size: 10pt" color=blue>'+player_scores[player_index[pi-1]][gi-1]+'</font></td>');
            }
         }
      }

      d.writeln('</tr>');  

      if ( (gi == 4) || (gi == 8) || (gi == 10) || (gi == 11) )
      {
         if (use_player_points == true)
         {
            if (gi == 4)
            {
               high_score_count   = week_1_high_score_count;
               high_score_players = week_1_high_score_players;
            }
            if (gi == 8)
            {
               high_score_count   = week_2_high_score_count;
               high_score_players = week_2_high_score_players;
            }
            if (gi == 10)
            {
               high_score_count   = week_3_high_score_count;
               high_score_players = week_3_high_score_players;
            }
            if (gi == 11)
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

         if (gi == 4)
         {
            d.writeln('<td nowrap class="br2_bb2_border" align=right colspan=5><font style="font-size: 11pt"><b>Week 1 Scores:&nbsp;</b></font></td>');
         }
         if (gi == 8)
         {
            d.writeln('<td nowrap class="br2_bb2_border" align=right colspan=5><font style="font-size: 11pt"><b>Week 2 Scores:&nbsp;</b></font></td>');
         }
         if (gi == 10)
         {
            d.writeln('<td nowrap class="br2_bb2_border" align=right colspan=5><font style="font-size: 11pt"><b>Week 3 Scores:&nbsp;</b></font></td>');
         }
         if (gi == 11)
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

            if ( (gi == 4) && (week_1_valid_game_cnt > 0) )
            {
               if (week_1_ranks[player_index[pi-1]] == 1) td_background = "bgcolor=#DCE6F1";
            }
            if ( (gi == 8) && (week_2_valid_game_cnt > 0) )
            {
               if (week_2_ranks[player_index[pi-1]] == 1) td_background = "bgcolor=#DCE6F1";
            }
            if ( (gi == 10) && (week_3_valid_game_cnt > 0) )
            {
               if (week_3_ranks[player_index[pi-1]] == 1) td_background = "bgcolor=#DCE6F1";
            }
            if ( (gi == 11) && (week_4_valid_game_cnt > 0) )
            {
               if (week_4_ranks[player_index[pi-1]] == 1) td_background = "bgcolor=#DCE6F1";
            }

            if (form_view == "expanded")
            {
               d.writeln('<td nowrap '+td_background+' class="gr1_bb2_border" colspan=3><font style="font-size: 9pt" color=blue>Rank = ');
               if (gi == 4)
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
               else if (gi == 8)
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
               else if (gi == 10)
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
               else if (gi == 11)
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
            if (gi == 4)
            {
               if (week_1_valid_game_cnt > 0)
               {
                  d.writeln(week_1_scores[player_index[pi-1]]);
               }
               else
               {
                  d.writeln('<br>');
               }
            }
            else if (gi == 8)
            {
               if (week_2_valid_game_cnt > 0)
               {
                  d.writeln(week_2_scores[player_index[pi-1]]);
               }
               else
               {
                  d.writeln('<br>');
               }
            }
            else if (gi == 10)
            {
               if (week_3_valid_game_cnt > 0)
               {
                  d.writeln(week_3_scores[player_index[pi-1]]);
               }
               else
               {
                  d.writeln('<br>');
               }
            }
            else if (gi == 11)
            {
               if (week_4_valid_game_cnt > 0)
               {
                  d.writeln(week_4_scores[player_index[pi-1]]);
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
         d.writeln('<td class="gr1_bb2_border" colspan=3><font style="font-size: 10pt"><b>Rank</b></font></td>');
      }
      if (pi == number_of_ps_players)
      {
         d.writeln('<td class="bb2_border"><font style="font-size: 10pt" color=blue><b>Score</b></font></td>');
      }
      else
      {
         d.writeln('<td class="br2_bb2_border"><font style="font-size: 10pt" color=blue><b>Score</b></font></td>');
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
         d.writeln('<td '+td_background+' class="bb1_border"><font style="font-size: 11pt" color=blue><b>'+overall_scores[player_index[pi-1]]+'</b></font></td>');
      }
      else
      {
         d.writeln('<td '+td_background+' class="br2_bb1_border"><font style="font-size: 11pt" color=blue><b>'+overall_scores[player_index[pi-1]]+'</b></font></td>');
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
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="get_scores_button" value="Get Scores"');
      d.writeln('    onClick=get_nfl_scores(document,"manual","");>');
      d.writeln('&nbsp;');
      d.writeln('<font face="Calibri" color=black style="font-size: 12pt">Auto Refresh:</font>&nbsp;');
      if (window.top.gv.get_scores_state == "off")
      {
         d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="get_scores_start_button" value="Start"');
         d.writeln('    onClick=get_scores_auto_refresh(document,"start");get_nfl_scores(document,"manual","Start");>');
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
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="calculate_scores_button" value="Calculate Scores"');
      d.writeln('    onClick="calculate_post_season_scores(document);return true;">');
      d.writeln('&nbsp;');
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="reset_scores_button" value="Reset Scores"');
      d.writeln('    onClick="reset_scores(document);return true;">');
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
         d.writeln('   <option value="week_'+wi+'_scores">Order By Week '+wi+' Score');
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
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="view_button" value="Less"');
   }
   else
   {
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="view_button" value="More"');
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
      var number_of_valid_games = 11;

      if (week == 1) number_of_valid_games =  4;
      if (week == 2) number_of_valid_games =  8;
      if (week == 3) number_of_valid_games = 10;
      if (week == 4) number_of_valid_games = 11;

      for (var gi = 1; gi <= number_of_valid_games; gi++)
      {
         if ( (post_season_winners[gi-1] != "V") && (post_season_winners[gi-1] != "H") )
         {
            d.writeln('<script>document.fp_scores.visitor'+gi+'_score.focus();</'+'script>');
            break;
         }
         d.writeln('<script>document.fp_scores.order_by_menu.focus();</'+'script>');
      }

      if (window.top.gv.get_scores_timer != null)
      {
         clearInterval(window.top.gv.get_scores_timer);
      }

      if (window.top.gv.get_scores_state == "on")
      {
         window.top.gv.get_scores_timer = setInterval('get_nfl_scores(document,"auto","");',15000);
      }
   }
   else
   {
      d.writeln('<script>document.fp_scores.order_by_menu.focus();</'+'script>');
   }
   d.writeln('');

   d.writeln('</body>');
   d.writeln('');

   d.writeln('</html>');

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
   var bullet_color                  = "";
   var color_black                   = "black";
   var color_red                     = "red";
   var document_heading              = "";
   var duplicates                    = 0;
   var form_view                     = window.top.gv.form_view;
   var game_state                    = "at";
   var input_tag_style               = "";
   var home_team_possession_flag     = "";
   var mn_points_delta_string        = "";
   var mn_points_string              = " ";
   var mode                          = window.top.gv.mode;
   var mode_string                   = "";
   var order_by                      = window.top.gv.order_by;
   var player_colspan                = 3;
   var rs_players                    = window.top.gv.rs_players;
   var tie_breaker_needed            = false;
   var unable_to_break_tie           = false;
   var unaltered_week                = 0;
   var victors                       = "";
   var visiting_team_possession_flag = "";
   var week                          = window.top.gv.current_input_week;
   var winners                       = "";

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
      week        = 17;
   }

   if (week <  1) week =  1;
   if (week > 17) week = 17;

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

   var high_score           = 0;
   var high_score_count     = 0;
   var number_of_games      = home_teams.length;
   var number_of_rs_players = rs_players.length;
   var max_scores           = [16,31,45,58,70,81,91,100,108,115,121,126,130,133,135,136];
   var max_score            = max_scores[number_of_games-1];
   var mn_points_delta      = ["N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A"];
   var player_index         = [0,1,2,3,4,5,6,7,8,9,10,11];
   var ranks                = [1,1,1,1,1,1,1,1,1,1,1,1];
   var ranks_adjust         = [0,0,0,0,0,0,0,0,0,0,0,0];
   var scores               = [max_score,max_score,max_score,max_score,max_score,max_score,max_score,max_score,max_score,max_score,max_score,max_score];
   var sorted_scores        = [1,1,1,1,1,1,1,1,1,1,1,1];


   if (window.top.gv.mn_points_entered > 0)
   {
      // Override actual_mn_points with points entered on preliminary form

      actual_mn_points = window.top.gv.mn_points_entered;
   }

   in_progress_mn_points = parseInt(home_scores[number_of_games-1].replace(/&nbsp;/g,"")) + parseInt(visiting_scores[number_of_games-1].replace(/&nbsp;/g,""));

   if (isNaN(in_progress_mn_points) == true) in_progress_mn_points = 0;

   if (in_progress_mn_points > 0)
   {
      // Override actual_mn_points with actual Monday Night Total Points from get_nfl_winners

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

   for (var i = 1; i <= number_of_games; i++)
   {
      // Determine if any game from get_nfl_winners has ended in a tie.

      for (var j = 1; j <= number_of_games; j++)
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

      for (var i = 0; i < number_of_games; i++)
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
   d.writeln('   if ( (player_menu_index < 0) || (player_menu_index > window.top.gv.number_of_rs_players) )');
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
   d.writeln('   clear_get_winners_data();  // Clear information set by "Get Winners".');
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
   d.writeln('function clear_get_winners_data()');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Clear information set by "Get Winners".');
   d.writeln('');
   d.writeln('   for (var i = 0; i < '+number_of_games+'; i++)');
   d.writeln('   {');
   d.writeln('      window.top.gv.home_scores[i]     = "";');
   d.writeln('      window.top.gv.visiting_scores[i] = "";');
   d.writeln('      window.top.gv.prelim_victors[i]  = "";');
   d.writeln('   }');
   d.writeln('');
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
   d.writeln('   clear_get_winners_data();  // Clear information set by "Get Winners".');
   d.writeln('');
   d.writeln('   for (var i = 0; i < '+number_of_games+'; i++)');
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
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   var abort                   = false;');
   d.writeln('   var all_winners_specified   = true;');
   d.writeln('   var best_winners            = ["","","","","","","","","","","","","","","",""];');
   d.writeln('   var best_outcome_definition = "";');
   d.writeln('   var binary_winners          = "";');
   d.writeln('   var extended_string         = "";');
   d.writeln('   var games_won               = 0;');
   d.writeln('   var max_opponent_score      = 0;');
   d.writeln('   var max_score_difference    = -1000;');
   d.writeln('   var most_games_won          = 0;');
   d.writeln('   var name_index              = 0;');
   d.writeln('   var name_menu               = 0;');
   d.writeln('   var number_of_games         = 0;');
   d.writeln('   var number_of_rs_players    = window.top.gv.rs_players.length;');
   d.writeln('   var opponent_score          = 0;');
   d.writeln('   var performance_warning     = "Depending on the speed of your computer, it may take a minute or longer to run.  Your browser might display a dialog window indicating that a script is causing your browser to run slow.  If so, it will ask if you want to abort the script.  Click on \\"No\\" or\\"Cancel\\" so that you don\'t abort the script.\\n\\n\\n";');
   d.writeln('   var picks                   = "";');
   d.writeln('   var progress_counter        = 0;');
   d.writeln('   var progress_percent        = 0;');
   d.writeln('   var progress_window         = null');
   d.writeln('   var score_difference        = 0;');
   d.writeln('   var selected_opponent_index = window.top.gv.opponent_index-1;');
   d.writeln('   var selected_player_index   = window.top.gv.player_index-1;');
   d.writeln('   var selected_player_picks   = ["","","","","","","","","","","","","","","",""];');
   d.writeln('   var selected_player_weights = ["","","","","","","","","","","","","","","",""];');
   d.writeln('   var selected_player_score   = 0;');
   d.writeln('   var selected_player_win     = false;');
   d.writeln('   var selected_winners        = ["","","","","","","","","","","","","","","",""];');
   d.writeln('   var skip_iteration          = false;');
   d.writeln('   var specified_winner_count  = 0;');
   d.writeln('   var temp_name               = "";');
   d.writeln('   var warning                 = "";');
   d.writeln('   var week                    = window.top.gv.current_input_week - 1;');
   d.writeln('   var weights                 = "";');
   d.writeln('   var winners_iteration       = ["","","","","","","","","","","","","","","",""];');
   d.writeln('');
   d.writeln('');
   d.writeln('   // Adjust week, in case it is invalid for some reason.');
   d.writeln('');
   d.writeln('   if (week <  1) week = 1;');
   d.writeln('   if (week > 17) week = 17;');
   d.writeln('');
   d.writeln('   // Assign number_of_games, picks, and weights based on week.');
   d.writeln('');
   d.writeln('   number_of_games = window.top.gv.all_home_teams[week-1].length;');
   d.writeln('   picks           = all_picks[week-1];');
   d.writeln('   weights         = all_weights[week-1];');
   d.writeln('');
   d.writeln('   clear_get_winners_data();  // Clear information set by "Get Winners".');
   d.writeln('');
   d.writeln('   // Get selected winners from preliminary form.');
   d.writeln('');
   d.writeln('   all_winners_specified = true;');
   d.writeln('');
   d.writeln('   get_selected_winners(document);');
   d.writeln('');
   d.writeln('   for (var game_index = 0; game_index < number_of_games; game_index++)');
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
   d.writeln('      if (selected_player_index >= 0) extended_string = " to see the best outcome for " + build_player_name((selected_player_index+1),true);');
   d.writeln('');
   d.writeln('      alert("Winners have already been specified for every game.  If the scores have not already been calculated, then click on the \\"Calculate Scores\\" button"+extended_string+".");');
   d.writeln('');
   d.writeln('      document.fp_results.calculate_scores_button.focus();');
   d.writeln('');
   d.writeln('      abort = true;');
   d.writeln('   }');
   d.writeln('   else if (selected_player_index < 0)');
   d.writeln('   {');
   d.writeln('      alert("Please select a player for \\"Best Outcome\\".");');
   d.writeln('');
   d.writeln('      document.fp_results.player_name_menu.focus();');
   d.writeln('');
   d.writeln('      abort = true;');
   d.writeln('   }');
   d.writeln('   else if (selected_player_index == selected_opponent_index)');
   d.writeln('   {');
   d.writeln('      alert("Please select an opponent for \\"Best Outcome\\" that is different from the player.");');
   d.writeln('');
   d.writeln('      document.fp_results.opponent_name_menu.focus();');
   d.writeln('');
   d.writeln('      abort = true;');
   d.writeln('   }');
   d.writeln('   else if (picks[selected_player_index].length == 0)');
   d.writeln('   {');
   d.writeln('      alert("The player selected for \\"Best Outcome\\" did not submit picks this week.");');
   d.writeln('');
   d.writeln('      document.fp_results.player_name_menu.focus();');
   d.writeln('');
   d.writeln('      abort = true;');
   d.writeln('   }');
   d.writeln('   else');
   d.writeln('   {');
   d.writeln('      if (number_of_games == 16)');
   d.writeln('      {');
   d.writeln('         warning = performance_warning;');
   d.writeln('      }');
   d.writeln('      else if ( (selected_opponent_index < 0) && (specified_winner_count < 2) )');
   d.writeln('      {');
   d.writeln('         warning = performance_warning;');
   d.writeln('      }');
   d.writeln('      else');
   d.writeln('      {');
   d.writeln('         warning = "\\n";');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      if (selected_opponent_index < 0)');
   d.writeln('      {');
   d.writeln('         best_outcome_definition = "By definition, the best outcome is when "+build_player_name((selected_player_index+1),true)+" ends up first with the biggest margin between his score and the second place score.  If it\'s not possible for "+build_player_name((selected_player_index+1),true)+" to end up first, then the best outcome is when the margin between his score and the first place score is smallest.";');
   d.writeln('         extended_string         = " ";');
   d.writeln('      }');
   d.writeln('      else');
   d.writeln('      {');
   d.writeln('         best_outcome_definition = "By definition, the best outcome is when "+build_player_name((selected_player_index+1),true)+" scores higher than "+build_player_name((selected_opponent_index+1),true)+" with the biggest margin between their scores.  If it\'s not possible for "+build_player_name((selected_player_index+1),true)+" to score higher than "+build_player_name((selected_opponent_index+1),true)+", then the best outcome is when the margin between their scores is smallest.";');
   d.writeln('         extended_string         = " against " + build_player_name((selected_opponent_index+1),true) + " ";');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      if (confirm("The best outcome for "+build_player_name((selected_player_index+1),true)+extended_string+"will be determined based on the following:\\n\\n\\n"+');
   d.writeln('                  "Games that have winners specified already (\\"H\\", \\"V\\", or \\"Tie\\") will remain unchanged.\\n\\n"+');
   d.writeln('                  "Each of the remaining games will be set to \\"H\\" or \\"V\\" depending on what combination yields the best outcome.  \\"Tie\\"s are not taken into account.\\n\\n"+');
   d.writeln('                  best_outcome_definition+"\\n\\n"+warning+');
   d.writeln('                  "Click on \\"OK\\" to continue.") == false) abort = true;;');
   d.writeln('   };');
   d.writeln('');
   d.writeln('   if (abort == true)');
   d.writeln('   {');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Assign selected_player_picks and selected_player_weights.');
   d.writeln('');
   d.writeln('   for (var game_index = 0; game_index < number_of_games; game_index++)');
   d.writeln('   {');
   d.writeln('      selected_player_picks[game_index]   = picks[selected_player_index][game_index];');
   d.writeln('      selected_player_weights[game_index] = weights[selected_player_index][game_index];');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Loop through for every possible win/loss combination for those games that do not already have a winner specified.');
   d.writeln('   // Games can end in a "Tie", but were are not going to take a "Tie" into account, unless the user specified a "Tie".');
   d.writeln('');
   d.writeln('   progress_window = create_progress_window();');
   d.writeln('');
   d.writeln('   for (var i = 0; i < Math.pow(2,number_of_games); i++)');
   d.writeln('   {');
   d.writeln('      progress_counter++;');
   d.writeln('');
   d.writeln('      if (progress_counter == 500)');
   d.writeln('      {');
   d.writeln('         progress_counter = 0;');
   d.writeln('         progress_percent = (i / Math.pow(2,number_of_games) * 100);');
   d.writeln('         progress_percent = Math.round(progress_percent);');
   d.writeln('');
   d.writeln('         update_progress_window(progress_window,progress_percent);');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      // Convert i into a binary string.');
   d.writeln('');
   d.writeln('      binary_winners = i.toString(2);'); 
   d.writeln('');
   d.writeln('      // Add leading zeros as needed to get the length to equal sixteen.');
   d.writeln('');
   d.writeln('      for (var j = (number_of_games-binary_winners.length); j > 0; j--)');
   d.writeln('      {');
   d.writeln('         binary_winners = "0" + binary_winners;');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      // Assign the winners for this iteration based on the binary_winners string.');
   d.writeln('');
   d.writeln('      for (var game_index = 0; game_index < number_of_games; game_index++)');
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
   d.writeln('      for (var game_index = 0; game_index < number_of_games; game_index++)');
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
   d.writeln('         selected_player_score = calculate_score(selected_player_picks,selected_player_weights,winners_iteration,number_of_games)');
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
   d.writeln('                  opponent_score     = calculate_score(picks[opponent_player_index],weights[opponent_player_index],winners_iteration,number_of_games)');
   d.writeln('                  max_opponent_score = Math.max(max_opponent_score,opponent_score);');  
   d.writeln('                  score_difference   = selected_player_score-max_opponent_score;'); 
   d.writeln('               }');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('');
   d.writeln('         if (score_difference > max_score_difference)');
   d.writeln('         {');
   d.writeln('            max_score_difference = score_difference;');
   d.writeln('            most_games_won       = calculate_games_won(selected_player_picks,selected_player_weights,winners_iteration,number_of_games);');
   d.writeln('');
   d.writeln('            // Set the winners to reflect the best win for the selected player.');
   d.writeln('');
   d.writeln('            for (var game_index = 0; game_index < number_of_games; game_index++)');
   d.writeln('            {');
   d.writeln('               best_winners[game_index] = winners_iteration[game_index];');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('         else if (score_difference == max_score_difference)');
   d.writeln('         {');
   d.writeln('            games_won = calculate_games_won(selected_player_picks,selected_player_weights,winners_iteration,number_of_games);');
   d.writeln('');
   d.writeln('            if (games_won > most_games_won)');
   d.writeln('            {');   
   d.writeln('               most_games_won = games_won;');
   d.writeln('');
   d.writeln('               // Set the winners to reflect the best win for the selected player.');
   d.writeln('');
   d.writeln('               for (var game_index = 0; game_index < number_of_games; game_index++)');
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
   d.writeln('   for (var game_index = 0; game_index < number_of_games; game_index++)');
   d.writeln('   {');
   d.writeln('      window.top.gv.prelim_winners[game_index] = best_winners[game_index];');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   progress_window.close();');
   d.writeln('');
   d.writeln('   // Re-display the preliminary form with the win/loss combination that reflects the best outcome for the selected player.');
   d.writeln('');
   d.writeln('   document.location.href = "fp_regular_season_form.html";');
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
   d.writeln('function get_nfl_winners(document,mode,command)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   var adjust_index                  = 0;');
   d.writeln('   var exit_loop                     = false;');
   d.writeln('   var game_clock_integer            = "";');
   d.writeln('   var game_clock_string             = "";');
   d.writeln('   var game_info                     = "";');
   d.writeln('   var game_state                    = "";');
   d.writeln('   var game_status                   = "game_not_started";');
   d.writeln('   var games_in_progress             = false;');
   d.writeln('   var home_score                    = "";');
   d.writeln('   var home_team                     = "";');
   d.writeln('   var home_teams                    = "";');
   d.writeln('   var index                         = 0;');
   d.writeln('   var nfl_connection                = null;');
   d.writeln('   var nfl_games_array               = new Array('+number_of_games+');');
   d.writeln('   var nfl_scores                    = null;');
   d.writeln('   var nfl_team_cities               = ["ARI",      "ATL",    "BAL",   "BUF",  "CAR",     "CHI",  "CIN",    "CLE",   "DAL",    "DEN",    "DET",  "NYG",   "GB",     "HOU",   "IND",  "JAX",    "NYJ", "KC",    "MIA",     "MIN",    "NE",      "NO",    "OAK",    "PHI",   "PIT",     "SD",      "SF",   "SEA",     "LA", "TB",        "TEN",   "WAS"     ];');
   d.writeln('   var nfl_team_names                = ["Cardinals","Falcons","Ravens","Bills","Panthers","Bears","Bengals","Browns","Cowboys","Broncos","Lions","Giants","Packers","Texans","Colts","Jaguars","Jets","Chiefs","Dolphins","Vikings","Patriots","Saints","Raiders","Eagles","Steelers","Chargers","49ers","Seahawks","Rams","Buccaneers","Titans","Redskins"];');
   d.writeln('   var possession_team               = "";');
   d.writeln('   var prelim_possession_teams_index = 0;');
   d.writeln('   var prelim_victors_index          = 0;');
   d.writeln('   var user_message                  = "";');
   d.writeln('   var visiting_score                = "";');
   d.writeln('   var visiting_team                 = "";');
   d.writeln('   var visiting_teams                = "";');
   d.writeln('   var week                          = window.top.gv.current_input_week-1;');
   d.writeln('   var winning_teams_index           = 0;');
   d.writeln('   var winning_teams                 = ["","","","","","","","","","","","","","","",""];');
   d.writeln('');
   d.writeln('');
   d.writeln('   if (command != "Start")');
   d.writeln('   {');
   d.writeln('      command = "Get Winners";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   clear_get_winners_data();  // Clear information set by previous call to "Get Winners".');
   d.writeln('');
   d.writeln('   home_teams     = window.top.gv.all_home_teams[week-1];');
   d.writeln('   visiting_teams = window.top.gv.all_visiting_teams[week-1];');
   d.writeln('');
   d.writeln('   // Attempt to get the NFL scores from the internet.');
   d.writeln('');
   d.writeln('   nfl_connection = new XMLHttpRequest();');
   d.writeln('');
   d.writeln('   try');
   d.writeln('   {');
   d.writeln('      nfl_connection.open("GET",encodeURI("https://query.yahooapis.com/v1/public/yql?q=select * from xml where url=\\"http://www.nfl.com/liveupdate/scorestrip/ss.xml\\""),false);');
   d.writeln('      nfl_connection.send(null);');
   d.writeln('');
   d.writeln('      if (nfl_connection.readyState == 4)');
   d.writeln('      {');
   d.writeln('         nfl_scores = nfl_connection.responseText;');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('   catch(e)');
   d.writeln('   {');
   d.writeln('      user_message = "\\"Get Winners\\" failed for some unknown reason.";');
   d.writeln('');
   d.writeln('      alert(user_message);');
   d.writeln('');
   d.writeln('      // Force auto refresh to be off if there is an error when attempting to get the NFL winners.');
   d.writeln('');
   d.writeln('      window.top.gv.get_winners_state = "off";');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (mode == "manual")');
   d.writeln('   {');
   d.writeln('      user_message = "\\""+ command + "\\" will do the following:\\n\\n";');
   d.writeln('      user_message = user_message + "   - Clear the winners on the Preliminary Form\\n";');
   d.writeln('      user_message = user_message + "   - Get all in-progress and final scores from the internet\\n";');
   d.writeln('      user_message = user_message + "   - Populate the Preliminary Form based on the scores from the internet\\n";');
   d.writeln('      if (command == "Start")');
   d.writeln('      {');
   d.writeln('         user_message = user_message + "   - Automatically update the Preliminary Form every 15 seconds\\n";');
   d.writeln('      }');
   d.writeln('      user_message = user_message + "   \\n\\nNOTE:  Winners with blue backgrounds indicate completed games.\\n\\n";');
   d.writeln('');
   d.writeln('      if (confirm(user_message) == false) return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Strip off all characters that preceed the first game in nfl_scores.');
   d.writeln('');
   d.writeln('   index = nfl_scores.indexOf("<g ");');
   d.writeln('');
   d.writeln('   if (index > -1)');
   d.writeln('   {');
   d.writeln('      nfl_scores = nfl_scores.substring(index);');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Extract each game out of nfl_scores and put them into the nfl_games_array.');
   d.writeln('');
   d.writeln('   for (var i = 0; i < '+number_of_games+'; i++)');
   d.writeln('   {');
   d.writeln('      // Replace the first occurrence of "<g " with "Xg " in nfl_scores in order to cause');
   d.writeln('      // the upcoming "nfl_scores.indexOf" call to skip over the first game in nfl_scores.');
   d.writeln('');
   d.writeln('      nfl_scores = "X" + nfl_scores.substring(1);');
   d.writeln('');
   d.writeln('      // Find the beginning of the second game in nfl_scores (which is where the end of the first game is).');
   d.writeln('');
   d.writeln('      index = nfl_scores.indexOf("<g ");');
   d.writeln('');
   d.writeln('      if (index > -1)');
   d.writeln('      {');
   d.writeln('         // Assign the first game in nfl_scores to the nfl_games_array.');
   d.writeln('');
   d.writeln('         nfl_games_array[i] = nfl_scores.substring(0,index);');
   d.writeln('');
   d.writeln('         // Strip off the first game in nfl_scores since we safely saved it in the nfl_games_array.');
   d.writeln('');
   d.writeln('         nfl_scores = nfl_scores.substring(index);');
   d.writeln('      }');
   d.writeln('      else');
   d.writeln('      {');
   d.writeln('         // This handles the last game which is all by itself at this point in nfl_scores.');
   d.writeln('');
   d.writeln('         nfl_games_array[i] = nfl_scores;');
   d.writeln('');
   d.writeln('         // Get out of this loop because there are no more games in nfl_scores.');
   d.writeln('');
   d.writeln('         exit_loop = true;');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      // Strip off unnecessary characters from the beginning of the current nfl_games_array game.');
   d.writeln('');
   d.writeln('      index = nfl_games_array[i].indexOf("hnn");');
   d.writeln('');
   d.writeln('      nfl_games_array[i] = nfl_games_array[i].substring(index);');
   d.writeln('');
   d.writeln('      // Strip off unnecessary characters from the end of the current nfl_games_array game.');
   d.writeln('');
   d.writeln('      index = nfl_games_array[i].indexOf("/>");');
   d.writeln('');
   d.writeln('      nfl_games_array[i] = nfl_games_array[i].substring(0,index);');
   d.writeln('');
   d.writeln('      // Delete other unnecessary characters from the current nfl_games_array game.');
   d.writeln('');
   d.writeln('      nfl_games_array[i] = nfl_games_array[i].replace(/"/g,"");');
   d.writeln('      nfl_games_array[i] = nfl_games_array[i].replace(/hnn=/g,"");');
   d.writeln('      nfl_games_array[i] = nfl_games_array[i].replace(/hs=/g,"");');
   d.writeln('      nfl_games_array[i] = nfl_games_array[i].replace(/vnn=/g,"");');
   d.writeln('      nfl_games_array[i] = nfl_games_array[i].replace(/vs=/g,"");');
   d.writeln('');
   d.writeln('      if (exit_loop == true) break;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Perform some more processing against each game within the nfl_games_array.');
   d.writeln('');
   d.writeln('   for (var i = 0; i < '+number_of_games+'; i++)');
   d.writeln('   {');
   d.writeln('      // Determine the status and state of the current nfl_games_array game.');
   d.writeln('');
   d.writeln('      if (nfl_games_array[i].indexOf("q=P") > -1)');
   d.writeln('      {');
   d.writeln('         game_status = "game_not_started";');
   d.writeln('      }');
   d.writeln('      else if (nfl_games_array[i].indexOf("q=F") > -1)');
   d.writeln('      {');
   d.writeln('         game_status = "game_over";');
   d.writeln('         game_state  = "<font size=-1>F</font>";');
   d.writeln('      }');
   d.writeln('      else');
   d.writeln('      {');
   d.writeln('         game_status       = "game_in_progress";');
   d.writeln('         game_clock_string = "";');
   d.writeln('');
   d.writeln('         // Set the game state to the game quarter, halftime, or overtime.');
   d.writeln('');
   d.writeln('         game_state = nfl_games_array[i].substring(nfl_games_array[i].indexOf("q=")+2,nfl_games_array[i].indexOf("q=")+3);');
   d.writeln('');
   d.writeln('         if ( (game_state > 0) && (game_state < 5) ) game_state = game_state + "Q";');
   d.writeln('');
   d.writeln('         if (game_state == "O") game_state = "OT";');
   d.writeln('');
   d.writeln('         // Set the game clock string if it exists.');
   d.writeln('');
   d.writeln('         if (nfl_games_array[i].indexOf("k=") > -1)');
   d.writeln('         {');
   d.writeln('            game_clock_string = nfl_games_array[i].substring(nfl_games_array[i].indexOf("k=")+2,nfl_games_array[i].indexOf("k=")+7);');
   d.writeln('         }');
   d.writeln('');
   d.writeln('         // Determine if there are two minutes or less to play in the 2nd quarter, 4th quarter, or overtime.');
   d.writeln('');
   d.writeln('         if ( (game_state.substring(0,2) == "2Q") || (game_state.substring(0,2) == "4Q") || (game_state.substring(0,2) == "OT") )');
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
   d.writeln('         // If the game clock exists, add it to the game state.');
   d.writeln('');
   d.writeln('         if (game_clock_string != "") game_state = game_state + " " + game_clock_string;');
   d.writeln('');
   d.writeln('         // Reduce the font size of the game state and save if for later assignment to window.top.gv.prelim_game_states.');
   d.writeln('');
   d.writeln('         game_state = "<font size=-1>"+game_state+"</font>";');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      // Split the nfl_games_array game into multiple parts so that the game information can easily be extracted.');
   d.writeln('');
   d.writeln('      game_info = nfl_games_array[i].split(" ",20);');  // Splitting into 20 parts is more than is needed but is safe.');
   d.writeln('');
   d.writeln('      // Reset the adjust_index value.');
   d.writeln('');
   d.writeln('      adjust_index = 0;');
   d.writeln('');
   d.writeln('      // Determine if the nfl_games_array game includes the game clock and if so account for it later when getting data out of game_info.');
   d.writeln('');
   d.writeln('      if (nfl_games_array[i].indexOf("k=") > -1) adjust_index++;');
   d.writeln('');
   d.writeln('      // Determine if the nfl_games_array game includes the possession and if so account for it later when getting data out of game_info.');
   d.writeln('');
   d.writeln('      // Also, remember which team actually has possession of the ball and if they are in the red zone.');
   d.writeln('');
   d.writeln('      if (nfl_games_array[i].indexOf("p=") > -1)');
   d.writeln('      {');
   d.writeln('         adjust_index++;');
   d.writeln('');
   d.writeln('         for (var j = 0; j < game_info.length; j++)');
   d.writeln('         {');
   d.writeln('            if (game_info[j].substring(0,2) == "p=")');
   d.writeln('            {');
   d.writeln('               // Remember which team has possession of the ball.');
   d.writeln('');
   d.writeln('               possession_team = game_info[j].slice(2);');
   d.writeln('');
   d.writeln('               // Determine the actual name of the team with possession of the ball from its abbreviated city name and save it.');
   d.writeln('')
   d.writeln('               for (var k = 0; k < nfl_team_cities.length; k++)');
   d.writeln('               {');
   d.writeln('                  if (possession_team == nfl_team_cities[k])');
   d.writeln('                  {');
   d.writeln('                     window.top.gv.prelim_possession_teams[prelim_possession_teams_index] = nfl_team_names[k];');
   d.writeln('');
   d.writeln('                     // Determine if the team with possession of the ball is in the red zone, and if so, remember it.');
   d.writeln('')
   d.writeln('                     if (nfl_games_array[i].indexOf("rz=1") > -1)');
   d.writeln('                     {');
   d.writeln('                        window.top.gv.prelim_red_zone_flags[prelim_possession_teams_index] = true;');
   d.writeln('                     }');
   d.writeln('');
   d.writeln('                     prelim_possession_teams_index++;');
   d.writeln('                  }');
   d.writeln('               }');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      // Extract the teams and their scores from the game_info.');
   d.writeln('');
   d.writeln('      visiting_team  = game_info[6+adjust_index];');
   d.writeln('      visiting_team  = visiting_team.charAt(0).toUpperCase() + visiting_team.slice(1);');
   d.writeln('      visiting_score = parseInt(game_info[7+adjust_index]);');
   d.writeln('');
   d.writeln('      home_team  = game_info[0];');
   d.writeln('      home_team  = home_team.charAt(0).toUpperCase() + home_team.slice(1);');
   d.writeln('      home_score = parseInt(game_info[1]);');
   d.writeln('');
   d.writeln('      //JL alert(":"+visiting_team+":"+visiting_score+":"+home_team+":"+home_score+":"+game_status+":"+game_state);');
   d.writeln('');
   d.writeln('      // If the current game is over or in progress, determine who the winning team is and save it.');
   d.writeln('');
   d.writeln('      if (game_status != "game_not_started")');
   d.writeln('      {');
   d.writeln('         games_in_progress = true;');
   d.writeln('');
   d.writeln('         if (visiting_score > home_score)');
   d.writeln('         {');
   d.writeln('            winning_teams[winning_teams_index] = visiting_team;');
   d.writeln('');
   d.writeln('            winning_teams_index++;');
   d.writeln('');
   d.writeln('            if (game_status == "game_over")');
   d.writeln('            {');
   d.writeln('               window.top.gv.prelim_victors[prelim_victors_index] = visiting_team;');
   d.writeln('');
   d.writeln('               prelim_victors_index++;');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('         else if (home_score > visiting_score)');
   d.writeln('         {');
   d.writeln('            winning_teams[winning_teams_index] = home_team;');
   d.writeln('');
   d.writeln('            winning_teams_index++;');
   d.writeln('')
   d.writeln('            if (game_status == "game_over")');
   d.writeln('            {');
   d.writeln('               window.top.gv.prelim_victors[prelim_victors_index] = home_team;');
   d.writeln('');
   d.writeln('               prelim_victors_index++;');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('         else if ( (home_score == visiting_score) && (game_status == "game_over") )');
   d.writeln('         {');
   d.writeln('            // Must put either the home or visitor team in the prelim_victors array so we know later that this "Tie" game is over.');
   d.writeln('');
   d.writeln('            window.top.gv.prelim_victors[prelim_victors_index] = home_team;');
   d.writeln('');
   d.writeln('            prelim_victors_index++;');
   d.writeln('         }');
   d.writeln('');
   d.writeln('         for (var j = 0; j < '+number_of_games+'; j++)');
   d.writeln('         {');
   d.writeln('            // The visiting_scores array, home_scores array, and game_state are strictly for display purposes only.');
   d.writeln('');
   d.writeln('            if (visiting_teams[j] == visiting_team) window.top.gv.visiting_scores[j] = "&nbsp;&nbsp;" + visiting_score;');
   d.writeln('');
   d.writeln('            if (home_teams[j] == home_team) window.top.gv.home_scores[j] = "&nbsp;&nbsp;" + home_score;');
   d.writeln('');
   d.writeln('            if ( (visiting_teams[j] == visiting_team) || (home_teams[j] == home_team) )');
   d.writeln('            {');
   d.writeln('               window.top.gv.prelim_game_states[j] = game_state;');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (games_in_progress == false)');
   d.writeln('   {');
   d.writeln('      if (mode == "manual")');
   d.writeln('      {');
   d.writeln('         alert("There are no Week " + week + " games in progress yet.");');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      // Force auto refresh to be off if no games are in progress.');
   d.writeln('');
   d.writeln('      window.top.gv.get_winners_state = "off";');
   d.writeln('   }');
   d.writeln('   else');
   d.writeln('   {');
   d.writeln('      // Update window.top.gv.prelim_winners so that the winners will appear on the form when it is redisplayed.');
   d.writeln('');
   d.writeln('      for (var i = 0; i < '+number_of_games+'; i++)');
   d.writeln('      {');
   d.writeln('         window.top.gv.prelim_winners[i] = "0";');
   d.writeln('');
   d.writeln('         for (var j = 0; j < '+number_of_games+'; j++)');
   d.writeln('         {');
   d.writeln('            if (visiting_teams[i] == winning_teams[j])');
   d.writeln('            {');
   d.writeln('               window.top.gv.prelim_winners[i] = "V";')
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
   d.writeln('   for (var i = 0; i < '+number_of_games+'; i++)');
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
   d.writeln('function get_winners_auto_refresh(document,command)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (command == "start")');
   d.writeln('   {');
   d.writeln('      if (window.top.gv.get_winners_state == "off")');
   d.writeln('      {');
   d.writeln('         window.top.gv.get_winners_state = "on";');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('   else  // command must equal "stop".');
   d.writeln('   {;');
   d.writeln('      if (window.top.gv.get_winners_state == "on")');
   d.writeln('      {');
   d.writeln('         clearInterval(window.top.gv.get_winners_timer);');
   d.writeln('');
   d.writeln('         window.top.gv.get_winners_state = "off";');
   d.writeln('         window.top.gv.get_winners_timer = null;');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('}');
   d.writeln('');
   d.writeln('</'+'script>');
   d.writeln('');
   d.writeln('');
   d.writeln('<center>');
   d.writeln('');
   if (top.gv.mobile == false)
   {
      d.writeln('<font style="font-family: Calibri; font-size: 16pt; font-weight: bold; color: maroon; padding: 10px">'+document_heading+'</font><p>');
      d.writeln('');
   }

   d.writeln('<form name="fp_results">');
   d.writeln('');

   d.writeln('<table align=center');
   d.writeln('       class="b3_border"');
   d.writeln('       border=0');
   d.writeln('       bgcolor=white');
   d.writeln('       cellpadding=2');
   d.writeln('       cellspacing=0>');
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
   d.writeln('<td class="bb2_border"><font style="font-size: 11pt"><b>VISITOR</b></font></td>');
   d.writeln('<td class="bb2_border"><font style="font-size: 11pt"></td>');
   d.writeln('<td class="gr1_bb2_border"><font style="font-size: 11pt"><b>HOME</b></font></td>');
   d.writeln('<td class="br2_bb2_border"><font style="font-size: 11pt"><b>WINNER</b></font></td>');
   for (var i = 1; i <= number_of_rs_players; i++)
   {
      if (form_view == "expanded")
      {
         d.writeln('<td class="gr1_bb2_border"><font style="font-size: 11pt"><b>pk</b></font></td>');
         d.writeln('<td class="gr1_bb2_border"><font style="font-size: 11pt"><b>wt</b></font></td>');
      }
      if (i == number_of_rs_players)
      {
         d.writeln('<td class="bb2_border"><font style="font-size: 11pt"><b>score</b></font></td>');
      }
      else
      {
         d.writeln('<td class="br2_bb2_border"><font style="font-size: 11pt"><b>score</b></font></td>');
      }
   }
   d.writeln('</tr>');
   d.writeln('');

   for (var i = 1; i <= number_of_games; i++)
   {
      if (mode == "prelim")
      {
         for (var j = 1; j <= number_of_games; j++)
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

         for (var j = 1; j <= number_of_games; j++)
         {
            if (prelim_possession_teams[j-1] == visiting_teams[i-1])
            {
               // Set the visiting team possession flag.

               if (prelim_red_zone_flags[j-1] == true) bullet_color = color_red;

               visiting_team_possession_flag = "<span style='font-weight:bold; color:"+bullet_color+"'>\u2022&nbsp;</span>";

               // Reset possession team and red zone flag.

               prelim_possession_teams[j-1] = "";
               prelim_red_zone_flags[j-1]   = false;

               break;
            }
            else if (prelim_possession_teams[j-1] == home_teams[i-1])
            {
               // Set the home team possession flag.

               if (prelim_red_zone_flags[j-1] == true) bullet_color = color_red;

               home_team_possession_flag = "<span style='font-weight:bold; color:"+bullet_color+"'>\u2022&nbsp;</span>";

               // Reset possession team and red zone flag.

               prelim_possession_teams[j-1] = "";
               prelim_red_zone_flags[j-1]   = false;

               break;
            }
         }

         // Set the game state flag (quarter, halftime, or overtime) if the game is in progress.

         game_state = window.top.gv.prelim_game_states[i-1];

         // Reset the game state flag.

         window.top.gv.prelim_game_states[i-1] = "at";
      }

      d.writeln('<tr align=center height=18px>');
      if (winners[i-1] == "V")
      {
         if (i == number_of_games)
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
         if (i == number_of_games)
         {
            d.writeln('<td nowrap class="gr1_bb1_border"><font style="font-size: 12pt">'+visiting_team_possession_flag+visiting_teams[i-1]+visiting_scores[i-1]+'</font></td>');
         }
         else
         {
            d.writeln('<td nowrap><font style="font-size: 12pt">'+visiting_team_possession_flag+visiting_teams[i-1]+visiting_scores[i-1]+'</font></td>');
         }
      }
      if (i == number_of_games)
      {
         d.writeln('<td nowrap class="gr1_bb1_border"><font style="font-size: 12pt">'+game_state+'</font></td>');
      }
      else
      {
         d.writeln('<td nowrap><font style="font-size: 12pt">'+game_state+'</font></td>');
      }
      if (winners[i-1] == "H")
      {
         if (i == number_of_games)
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
         if (i == number_of_games)
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
         if (i == number_of_games)
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
         if (i == number_of_games)
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
               if (i == number_of_games)
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
               if (i == number_of_games)
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
                  if (i == number_of_games)
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
                  if (i == number_of_games)
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
                  if (i == number_of_games)
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
                  if (i == number_of_games)
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
               if (i == number_of_games)
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
               if (i == number_of_games)
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
         d.writeln('<td class="bt2_gr1_border" colspan=2 align=right><font style="font-size: 12pt" color=blue>'+ranks[player_index[i-1]]+'&nbsp;&nbsp;</font></td>');
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

            for (var i = 1; i <= number_of_games; i++)
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
            tie_breaker_message = "Enter actual Monday Night Total Points (1-999) to break the tie:&nbsp;&nbsp;";
         }

         if ( (unable_to_break_tie == true) || (in_progress_mn_points < 1) )
         {
            d.writeln('<table align=center>');
            d.writeln('<tr><td class="no_border" style="font-size: 2pt">&nbsp;</td></tr>');
            d.writeln('<tr><td class="no_border"><font style="font-size: 14pt" color=maroon>'+tie_breaker_message+'</font>');

            if (unable_to_break_tie == false)
            {
               if (mn_pts_value == 0) mn_pts_value = "";

               d.writeln('<font style="font-size: 12pt"><input type=text style="text-align: center; font-size: 12pt; font-family: Calibri; border: 1px solid black" name="mn_points" size="3" maxlength="3" value="'+mn_pts_value+'"');
               d.writeln('                     onChange="get_mn_points(document);return true;"');
               d.writeln('                     onKeyPress="if (window.event.keyCode==13) {window.event.keyCode=0; get_mn_points(document); calculate_prelim_scores(document); return true;}"></font>');
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
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="get_winners_button" value="Get Winners"');
      d.writeln('    onClick=get_nfl_winners(document,"manual","");>');
      d.writeln('&nbsp;');
      d.writeln('<font style="font-size: 12pt">Auto Refresh:</font>&nbsp;');
      if (window.top.gv.get_winners_state == "off")
      {
         d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="get_winners_start_button" value="Start"');
         d.writeln('    onClick=get_winners_auto_refresh(document,"start");get_nfl_winners(document,"manual","Start");>');
      }
      else
      {
         d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="get_winners_stop_button" value="Stop"');
         d.writeln('    onClick=get_winners_auto_refresh(document,"stop");document.location.href="fp_regular_season_form.html";>');
      }
      d.writeln('</td>');
      d.writeln('</tr>');
      d.writeln('<tr><td class="no_border" style="font-size: 2pt">&nbsp;</td></tr>');
   }
   d.writeln('<tr align=center>');
   d.writeln('<td nowrap valign=middle class="no_border">');
   if (mode == "prelim")
   {
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="calculate_scores_button" value="Calculate Scores"');
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
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="view_button" value="Less"');
   }
   else
   {
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="view_button" value="More"');
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
      d.writeln('     onClick="determine_best_outcome(document);return true;">');
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
   if (number_of_games < 16)
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
      for (var i = 1; i <= number_of_games; i++)
      {
         if (winners[i-1] == "0")
         {
            d.writeln('<script>document.fp_results.winner'+i+'.focus();</'+'script>');
            break;
         }
         d.writeln('<script>document.fp_results.order_by_button.focus();</'+'script>');
      }

      if (window.top.gv.get_winners_timer != null)
      {
         clearInterval(window.top.gv.get_winners_timer);
      }

      if (window.top.gv.get_winners_state == "on")
      {
         window.top.gv.get_winners_timer = setInterval('get_nfl_winners(document,"auto","");',15000);
      }
   }
   else
   {
      d.writeln('<script>document.fp_results.order_by_button.focus();</'+'script>');
   }
   d.writeln('');

   d.writeln('</body>');
   d.writeln('');

   d.writeln('</html>');

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

   var actual_mn_points          = "";
   var all_games_won             = [[0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0]];
   var all_ranks                 = [[1,1,1,1,1,1,1,1,1,1,1,1],
                                    [1,1,1,1,1,1,1,1,1,1,1,1],
                                    [1,1,1,1,1,1,1,1,1,1,1,1],
                                    [1,1,1,1,1,1,1,1,1,1,1,1],
                                    [1,1,1,1,1,1,1,1,1,1,1,1],
                                    [1,1,1,1,1,1,1,1,1,1,1,1],
                                    [1,1,1,1,1,1,1,1,1,1,1,1],
                                    [1,1,1,1,1,1,1,1,1,1,1,1],
                                    [1,1,1,1,1,1,1,1,1,1,1,1],
                                    [1,1,1,1,1,1,1,1,1,1,1,1],
                                    [1,1,1,1,1,1,1,1,1,1,1,1],
                                    [1,1,1,1,1,1,1,1,1,1,1,1],
                                    [1,1,1,1,1,1,1,1,1,1,1,1],
                                    [1,1,1,1,1,1,1,1,1,1,1,1],
                                    [1,1,1,1,1,1,1,1,1,1,1,1],
                                    [1,1,1,1,1,1,1,1,1,1,1,1],
                                    [1,1,1,1,1,1,1,1,1,1,1,1]];
   var all_scores                = [[0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],
                                    [0,0,0,0,0,0,0,0,0,0,0,0],]; 
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
   var mn_points_delta           = ["N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A"];
   var number_of_games           = 0;
   var number_of_rs_players      = 0;
   var order_by                  = window.top.gv.order_by;
   var player_low_scores         = [999,999,999,999,999,999,999,999,999,999,999,999];
   var player_total_average_rank = "<br>";
   var player_total_games_won    = 0;
   var player_total_score        = 0;
   var ranks_adjust              = [0,0,0,0,0,0,0,0,0,0,0,0];
   var ranks_sum                 = 0;
   var rs_players                = window.top.gv.rs_players;
   var sort_index                = [0,1,2,3,4,5,6,7,8,9,10,11];
   var sorted_scores             = [1,1,1,1,1,1,1,1,1,1,1,1];
   var summary_title             = "";
   var table_data                = "";
   var td_background             = "";
   var tie_breaker_needed        = false;
   var total_1st_places          = [0,0,0,0,0,0,0,0,0,0,0,0];
   var total_2nd_places          = [0,0,0,0,0,0,0,0,0,0,0,0];
   var total_3rd_places          = [0,0,0,0,0,0,0,0,0,0,0,0];
   var total_average_ranks       = [12,12,12,12,12,12,12,12,12,12,12,12];
   var total_games_played        = 0;
   var total_games_won           = [0,0,0,0,0,0,0,0,0,0,0,0];
   var total_last_places         = [0,0,0,0,0,0,0,0,0,0,0,0];
   var total_missed_weeks        = [0,0,0,0,0,0,0,0,0,0,0,0];
   var total_ranks               = [1,1,1,1,1,1,1,1,1,1,1,1];
   var total_scores              = [0,0,0,0,0,0,0,0,0,0,0,0];
   var week                      = window.top.gv.current_input_week - 1;
   var weekly_last_place_scores  = [999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999,999];
   var weekly_max_games_won      = 0;
   var weekly_max_score          = 0;
   var weekly_picks              = "";
   var weekly_weights            = "";
   var weekly_winners            = "";
   var weeks_played              = 0;


   if (window.top.gv.games_over == false)       week--;
   if (week <  1)                               week = 1;
   if (week > 17)                               week = 17;
   if (window.top.gv.mode == "summary_archive") week = 17;

   number_of_rs_players = rs_players.length;
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
      actual_mn_points = all_actual_mn_points[week_index];
      mn_points        = all_mn_points[week_index];
      number_of_games  = window.top.gv.all_home_teams[week_index].length;
      ranks_adjust     = [0,0,0,0,0,0,0,0,0,0,0,0];
      sorted_scores    = [1,1,1,1,1,1,1,1,1,1,1,1];
      weekly_picks     = all_picks[week_index];
      weekly_weights   = all_weights[week_index];
      weekly_winners   = all_winners[week_index];

      // Calculate scores for the current week.

      for (var player_index = 0; player_index < number_of_rs_players; player_index++)
      {
         if (weekly_picks[player_index].length > 0)
         {
            for (var game_index = 0; game_index < number_of_games; game_index++)
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

         for (var game_index = 0; game_index < number_of_games; game_index++)
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

   sorted_scores = [1,1,1,1,1,1,1,1,1,1,1,1];

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
   if (top.gv.mobile == false)
   {
      d.writeln('<font style="font-family: Calibri; font-size: 16pt; font-weight: bold; color: maroon; padding: 10px">'+document_heading+'</font><p>');
      d.writeln('');
   }

   d.writeln('<form name="fp_results">');
   d.writeln('');

   d.writeln('<table align=center');
   d.writeln('       class="b3_border"');
   d.writeln('       border=0');
   d.writeln('       bgcolor=white');
   d.writeln('       cellpadding=2');
   d.writeln('       cellspacing=0>');
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

   for (var week_index = 0; week_index < 17; week_index++)
   {
      weekly_picks = all_picks[week_index];

      if (week_index == (17-1))
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
         if (week_index == (17-1))
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
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="view_button" value="Less"');
   }
   else
   {
      d.writeln('<input style="font-size: 11pt; font-family: Calibri; border: 1px solid black" type=button name="view_button" value="More"');
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

   d.writeln('');

   d.writeln('</body>');
   d.writeln('');

   d.writeln('</html>');

   d.close();

   return true;
}


function calculate_games_won(picks,weights,winners,number_of_games)
{
   var games_won = 0;

   // Calculate number of games won for the current week.

   if (picks.length > 0)
   {
      for (var game_index = 0; game_index < number_of_games; game_index++)
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


function calculate_score(picks,weights,winners,number_of_games)
{
   var score = 0;

   // Calculate scores for the current week.

   if (picks.length > 0)
   {
      for (var game_index = 0; game_index < number_of_games; game_index++)
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


function create_progress_window()
{
   var w                     = null;
   var window_height         = 100;
   var window_width          = 250;
   var x_position            = (screen.width-window_width) / 2;
   var y_position            = 100;


   w = window.open("","progress_window","status=0,screenX="+x_position+",screenY="+y_position+",left="+x_position+",top="+y_position+",height="+window_height+",width="+window_width);

   w.resizeTo(window_width,window_height);

   return w;
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


function update_progress_window(progress_window,progress_percent)
{
   var wd            = null;
   var window_height = 100;
   var window_width  = 250;
   var x_position    = (screen.width-window_width) / 2;
   var y_position    = 100;


   wd = progress_window.document.open();

   wd.writeln('<html>');
   wd.writeln('');
   wd.writeln('<head>');
   wd.writeln('   <title>Progress</title>');
   wd.writeln('   <link href="fp.css" rel="stylesheet" type="text/css">');
   wd.writeln('</head>');
   wd.writeln('');
   wd.writeln('<body class="light_gray_background"');
   wd.writeln('      style="color: black;');
   wd.writeln('       font-family: Calibri;">');
   wd.writeln('');
   wd.writeln('<center><b>Best Outcome Progress:&nbsp;&nbsp;'+progress_percent+' %</b></center>');
   wd.writeln('');
   wd.writeln('</body>');
   wd.writeln('');
   wd.writeln('</html>');

   wd.close();

   progress_window.moveTo(x_position,y_position);

   progress_window.focus();

   return true;
}
