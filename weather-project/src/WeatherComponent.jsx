import { useEffect, useState } from "react";
import "./WeatherComponent.css"


// 定数URLの管理 東京, 大阪, 札幌
const WEATHER_API_URL = [
    "https://www.jma.go.jp/bosai/forecast/data/forecast/130000.json", 
    "https://www.jma.go.jp/bosai/forecast/data/forecast/270000.json",
    "https://www.jma.go.jp/bosai/forecast/data/forecast/016000.json",
];

// エラーハンドリングの共通関数
const handleError = (error) => {
    console.error("Error:", error);
    return "データの取得に失敗しました";
};

// データ取得の非同期関数
const fetchWeatherData = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response.json();
};

// 日付の表示をx月x日に変換する関数
const changeFormat = (x) => {
    const date = new Date(x);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
};

const areas = ["東京地方", "大阪府", "石狩地方"];
const temAreas = ["東京", "大阪", "札幌"];

const WeatherComponent = () => {
    const [data, setData] = useState({
        date: [],
        weather: [],
        temps: [],
        tempsFuture: [[], []],
        error: null,
    });
    const [city, setCity] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const weatherData = await fetchWeatherData(WEATHER_API_URL[city]);

                const cityWeather = weatherData[0].timeSeries[0].areas.find(
                    (area) => area.area.name === areas[city]
                );
                const cityTemperatures = weatherData[0].timeSeries[2].areas.find(
                    (area) => area.area.name === temAreas[city]
                );
                const cityFuture = weatherData[1].timeSeries[1].areas.find(
                    (area) => area.area.name === temAreas[city]
                );

                const dateToday = weatherData[0].timeSeries[0].timeDefines;
                const showDates = dateToday.map((x) => changeFormat(x));

                setData({
                    date: showDates,
                    temps: cityTemperatures?.temps || [],
                    weather: cityWeather?.weathers || [],
                    tempsFuture: [
                        cityFuture?.tempsMax || [],
                        cityFuture?.tempsMin || [],
                    ],
                    error: null,
                });
            } catch (error) {
                setData((prevData) => ({ ...prevData, error: handleError(error) }));
            }
        };
        fetchData();
    }, [city]);

    return (
        <div className="weather-container">
            <h1>天気予報</h1>
            <label htmlFor="city-select">都道府県選択：</label>
            <select id="city-select" onChange={(e) => setCity(Number(e.target.value))}>
                <option value="0">東京</option>
                <option value="1">大阪</option>
                <option value="2">札幌</option>
            </select>
    
            {data.error ? (
                <p className="error-message">{data.error}</p>
            ) : (
                <div className="weather-info">
                    <div className="weather-card">
                        <p>今日：{data.date[0] || "N/A"}</p>
                        <p>天気：{data.weather[0] || "N/A"}</p>
                        <p>気温：{data.temps[0] || "N/A"}</p>
                    </div>
                    <div className="weather-card">
                        <p>明日：{data.date[1] || "N/A"}</p>
                        <p>天気：{data.weather[1] || "N/A"}</p>
                        <p>気温：{data.temps[1] || "N/A"}</p>
                    </div>
                    <div className="weather-card">
                        <p>明後日: {data.date[2] || "N/A"}</p>
                        <p>天気： {data.weather[2] || "N/A"}</p>
                        <p>気温:{data.tempsFuture[1][1]}~{data.tempsFuture[0][1]}</p>
                    </div>
                </div>
            )}
        </div>
    );
    
};


export default WeatherComponent;

