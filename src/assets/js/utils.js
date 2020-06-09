export const getDateFormat = (dateFormat) => {
    let yyyy = dateFormat.getFullYear();
    let mm = dateFormat.getMonth() + 1 < 10 ? '0' + (dateFormat.getMonth() + 1) : dateFormat.getMonth() + 1;
    let dd = dateFormat.getDate() < 10 ? '0' + dateFormat.getDate() : dateFormat.getDate();
    return `${yyyy}-${mm}-${dd}`
}
  export const parseMonths = (month) => {
    switch (month) {
      case 1:
        return 'Jan';
        break;
      case 2:
        return 'Feb';
        break;
      case 3:
        return 'Mar';
        break;
      case 4:
        return 'Apr';
        break;
      case 5:
        return 'May';
        break;
      case 6:
        return 'Jun';
        break;
      case 7:
        return 'Jul';
        break;
      case 8:
        return 'Aug';
        break;
      case 9:
        return 'Sep';
        break;
      case 10:
        return 'Oct';
        break;
      case 11:
        return 'Nov';
        break;
      case 12:
        return 'Dec';
        break;
    }
  } 

  export const parseDays = (days) => {
    switch (days) {
      case 1:
        return 'Mon';
        break;
      case 2:
        return 'Tues';
        break;
      case 3:
        return 'Wed';
        break;
      case 4:
        return 'Thur';
        break;
      case 5:
        return 'Fri';
        break;
      case 6:
        return 'Sat';
        break;
      case 0:
        return 'Sun';
        break;
  
    }
  }

  export const formatString = (val)=>{
    if(typeof(val)==='number'){
      let date = new Date(val);
      let m = date.getMonth()+1;
      let c = (date+'').split(' ');
      return `${c[2]} ${c[1]} ${c[3]}`;
    }else{
      return val;
    }
  }