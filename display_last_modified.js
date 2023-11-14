
function display_last_modified (last_modified_document, display_document)
{
   if (last_modified_document.lastModified == 0)
   {
      display_document.write("Unknown");
      return false;
   }

   Last_Modified = new Date(last_modified_document.lastModified);

   Hour   = Last_Modified.getHours();
   Minute = Last_Modified.getMinutes();
   Month  = Last_Modified.getMonth();

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
         Month = "Jan";
         break;
      case 1:
         Month = "Feb";
         break;
      case 2:
         Month = "Mar";
         break;
      case 3:
         Month = "Apr";
         break;
      case 4:
         Month = "May";
         break;
      case 5:
         Month = "Jun";
         break;
      case 6:
         Month = "Jul";
         break;
      case 7:
         Month = "Aug";
         break;
      case 8:
         Month = "Sep";
         break;
      case 9:
         Month = "Oct";
         break;
      case 10:
         Month = "Nov";
         break;
      case 11:
         Month = "Dec";
         break;
      default:
         break;
   }

   display_document.write(Month," ",Last_Modified.getDate(),", ",Last_Modified.getFullYear()," at ",Hour,":",Minute," ",AM_PM);

   return true;
}
