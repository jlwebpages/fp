function display_last_modified (last_modified_document, display_document)
{
   if (last_modified_document.lastModified == 0)
   {
      display_document.write("Unknown");
      return false;
   }

   Last_Modified = new Date(last_modified_document.lastModified);

   Day    = Last_Modified.getDay();
   Hour   = Last_Modified.getHours();
   Minute = Last_Modified.getMinutes();
   Month  = Last_Modified.getMonth();

   switch (Day)
   {
      case 0:
         Day = "Sunday";
         break;
      case 1:
         Day = "Monday";
         break;
      case 2:
         Day = "Tuesday";
         break;
      case 3:
         Day = "Wednesday";
         break;
      case 4:
         Day = "Thursday";
         break;
      case 5:
         Day = "Friday";
         break;
      case 6:
         Day = "Saturday";
         break;
      default:
         break;
   }

   if (Hour > 12)
   {
      Hour = Hour-12;
      AM_PM = "PM";
   }
   else
   {
      AM_PM = "AM";
   }

   if (Minute < 10) Minute = "0" + Minute;

   switch (Month)
   {
      case 0:
         Month = "January";
         break;
      case 1:
         Month = "February";
         break;
      case 2:
         Month = "March";
         break;
      case 3:
         Month = "April";
         break;
      case 4:
         Month = "May";
         break;
      case 5:
         Month = "June";
         break;
      case 6:
         Month = "July";
         break;
      case 7:
         Month = "August";
         break;
      case 8:
         Month = "September";
         break;
      case 9:
         Month = "October";
         break;
      case 10:
         Month = "November";
         break;
      case 11:
         Month = "December";
         break;
      default:
         break;
   }

   display_document.write(Day," - ",Month," ",Last_Modified.getDate(),", ",
                          Last_Modified.getFullYear()," - ",Hour,":",Minute," ",AM_PM);

   return true;
}