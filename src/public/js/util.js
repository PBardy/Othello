export function randInt(min, max) {
  return Math.floor(Math.random() * max) + min;
}

export function inRange(value, min, max) {
  return value >= min && value <= max;
}

export function padStart(string, padding, amount) {
  let padded = "";
  for(let i = 0; i < amount - 1; i++) {
    padded += padding;
  }
  padded += string ? string : padding;
  return padded.substr(padded.length - amount);
}

export function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

export function getCookie(cname) {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}