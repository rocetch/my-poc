import date from 'date-and-time';
import { useState, useEffect } from 'react';
import styles from '../styles/world-clock.module.css';
import dotWorldMap from '../lib/world-map.json';

const cities = {
  tokyo: {cityName: '東京 / 首爾', timeZone: 'Asia/Tokyo'},
  taipei: {cityName: '台北 / 上海', timeZone: 'Asia/Taipei'},
  newdelhi: {cityName: '新德里', timeZone: 'Asia/Kolkata'},
  amsterdam: {cityName: '阿姆斯特丹', timeZone: 'Europe/Amsterdam'},
  newyork: {cityName: '紐約 / 渥太華', timeZone: 'America/New_York'},
  austin: {cityName: '奧斯汀', timeZone: 'America/Chicago'},
  sanjose: {cityName: '聖荷西', timeZone: 'America/Los_Angeles'},
};

function getCurrentDateTime() {
  const now = new Date();
  const citiesDatetime = {};
  Object.keys(cities).map((key) => {citiesDatetime[key] = getCityDateTime(now, cities[key])});
  return citiesDatetime;
}

function getCityDateTime(datetime, city) {
  const cityDatetime = date.parse(
    datetime.toLocaleString('en-US', { timeZone: city.timeZone }),
    'M/D/YYYY, h:mm:ss A');

  return {
    cityName: city.cityName,
    timeStr: date.format(cityDatetime, 'HH:mm'),
    dateStr: date.format(cityDatetime, 'MMM D, YYYY'),
    weekStr: date.format(cityDatetime, 'dddd')
  };
}

export default function WorldClock() {
  const clockCardStyle = styles['clock-card'];
  const clockCardStyleActive = [styles['clock-card'], styles['selected']].join(' ');
  const mapPinStyle = styles['map-pin'];
  const mapPinStyleActive = [styles['map-pin'], styles['selected']].join(' ');
  function getClockCardStyle(city) {
    return (activeCity === city) ? clockCardStyleActive : clockCardStyle;
  }
  function getMapPinStyle(city) {
    return (activeCity === city) ? mapPinStyleActive : mapPinStyle;
  }

  function clickHandler(city) {
    const targetCity = (activeCity === city) ? '' : city;
    setActiveCity(targetCity);
  }

  const [activeCity, setActiveCity] = useState('');
  const [now, setNow] = useState(getCurrentDateTime);
  useEffect(() => {
    const interval = setInterval(() => setNow(getCurrentDateTime), 1000);
    return () => {
      clearInterval(interval);
    }
  }, []);

  return (
    <div className={styles['world-clock']}>
      <h3>全球時鐘</h3>
      <div className={styles['world-map']}>
        <svg viewBox="-1 -1 127 61" xmlns="http://www.w3.org/2000/svg" 
            style={{'background-color': 'transparent'}}>
          {
            dotWorldMap.map((dot) => (
              (dot.city) ?
                <circle key={'dot-'+dot.cx+'-'+dot.cy} className={getMapPinStyle(dot.city)} onClick={() => clickHandler(dot.city)} cx={dot.cx} cy={dot.cy}></circle>
              :
                <circle key={'dot-'+dot.cx+'-'+dot.cy} className={styles['map-dot']} cx={dot.cx} cy={dot.cy}></circle>
            ))
          }
        </svg>
      </div>
      <div className={styles['clock-cards']}>
        {Object.keys(now).map((cityKey) => (
          <div key={'city-' + cityKey} className={getClockCardStyle(cityKey)} onClick={() => clickHandler(cityKey)}>
            <span className={styles['cityName']}>{now[cityKey].cityName}</span>
            <span className={styles['timeStr']}>{now[cityKey].timeStr}</span>
            <span className={styles['dateStr']}>{now[cityKey].dateStr}</span>
            <span className={styles['weekStr']}>{now[cityKey].weekStr}</span>
          </div>
        ))}
        <div className={styles['clock-card-placeholder']}></div>
        <div className={styles['clock-card-placeholder']}></div>
        <div className={styles['clock-card-placeholder']}></div>
      </div>
    </div>
  );
}