import React, { useState, useEffect } from "react";
import AxiosInstance from "../Axiosconfig/Axios.config";

const Home = () => {
  const [userUrls, setUserUrls] = useState([]);
  const [overallAnalytics, setOverallAnalytics] = useState({});
  const [topicAnalytics, setTopicAnalytics] = useState({});
  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTopicUrls, setSelectedTopicUrls] = useState([]);
  console.log("selectedTopicUrls", selectedTopicUrls);
  const [RedirectOrig, setRedirectOrig] = useState([]);
  console.log("RedirectOrig", RedirectOrig);
  const [UrlAnalytics, setUrlAnalytics] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    AxiosInstance.get(`/url?token=${token}`)
      .then((response) => {
        setUserUrls(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error("Error fetching user URLs:", error);
        setError("Error fetching your URLs.");
      });

    AxiosInstance.get(`/url/overallAnalytics?token=${token}`)
      .then((response) => {
        setOverallAnalytics(response.data);
      })
      .catch((error) => {
        console.error("Error fetching overall analytics:", error);
        setError("Error fetching overall analytics.");
      });
  }, []);

  const handleShortenUrl = async () => {
    if (!longUrl) {
      setError("Please provide a long URL.");
      return;
    }

    setLoading(true);
    try {
      const response = await AxiosInstance.post(`/url/shorten?token=${token}`, {
        longUrl,
        customAlias,
        topic,
      });
      setUserUrls((prevUrls) => [...prevUrls, response.data]);
      setLongUrl("");
      setCustomAlias("");
      setTopic("");
      setLoading(false);
    } catch (err) {
      setError("Error creating short URL.");
      setLoading(false);
    }
  };

  const fetchTopicUrls = async (selectedTopic) => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get(
        `/url/analytics/topic/${selectedTopic}?token=${token}`
      );
      setSelectedTopicUrls(response.data.urls || []);
      setTopicAnalytics(response.data.analytics || {});
      setLoading(false);
    } catch (err) {
      setError("Error fetching topic analytics.");
      setLoading(false);
    }
  };

  const handleTopicClick = (topicName) => {
    fetchTopicUrls(topicName);
  };

  const redirectToOriginalUrl = async (alias) => {
    try {
      const response = await AxiosInstance.get(`/url/${alias}`);
      if (response) {
        setRedirectOrig(response?.data);
      } else {
        setError("URL not found.");
      }
    } catch (error) {
      setError("Error redirecting to the original URL.");
    }
  };
  const getUrlAnalytics = async (alias) => {
    try {
      const response = await AxiosInstance.get(
        `/url/analytics/${alias}?token=${token}`
      );
      console.log("getUrlAnalytics response", response);
      if (response) {
        setUrlAnalytics(response?.data);
        console.log("UrlAnalytics", UrlAnalytics);
      } else {
        setError("URL not found.");
      }
    } catch (error) {
      setError("Error redirecting to the original URL.");
    }
  };
  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg space-y-10">
      <h1 className="text-4xl font-bold text-center text-white">
        Welcome to Your URL Shortener
      </h1>

      {/* Shorten URL Form */}
      <div className="bg-white shadow-lg rounded-lg p-8 space-y-6 border border-gray-300">
        <h2 className="text-3xl font-semibold text-gray-800">Shorten a URL</h2>
        <div className="space-y-4">
          <input
            type="url"
            placeholder="Enter long URL"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
          />
          <input
            type="text"
            placeholder="Custom Alias (optional)"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
          />
          <input
            type="text"
            placeholder="Topic (optional)"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button
            onClick={handleShortenUrl}
            disabled={loading}
            className="w-full bg-blue-600 text-white p-4 rounded-lg disabled:bg-blue-300 focus:outline-none hover:bg-blue-700 transition-all"
          >
            {loading ? "Shortening..." : "Shorten URL"}
          </button>
          {error && (
            <div className="text-red-600 text-center mt-2">{error}</div>
          )}
        </div>
      </div>

      {/* User URLs List */}
      <div className="bg-white shadow-lg rounded-lg p-8 space-y-6 border border-gray-300">
        <h2 className="text-3xl font-semibold text-gray-800">
          Your Shortened URLs
        </h2>
        <ul className="space-y-4">
          {userUrls.length > 0 ? (
            userUrls.map((url) => (
              <li
                key={url._id}
                className="flex justify-between items-center p-4 border-b border-gray-200"
              >
                <span className="text-gray-700 text-sm">{url.shortUrl}</span>
                <button
                  onClick={() => redirectToOriginalUrl(url.alias)}
                  className="text-blue-600 text-sm"
                >
                  Redirect To Original
                </button>
                <button
                  onClick={() => getUrlAnalytics(url.alias)}
                  className="text-blue-600 text-sm"
                >
                  View Url Analytics
                </button>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-600">No URLs created yet.</p>
          )}
          {RedirectOrig && RedirectOrig.longUrl && (
            <div className="mt-6 p-6 bg-white shadow-lg rounded-lg border border-gray-300">
              <h3 className="text-2xl font-semibold text-gray-800">
                Original URL Data
              </h3>
              <p className="text-sm text-gray-600">
                <strong>Original URL:</strong>{" "}
                <span className="text-blue-600">{RedirectOrig.longUrl}</span>
              </p>
              <p className="text-sm text-gray-600">
                <strong>Alias:</strong>{" "}
                <span className="font-semibold">{RedirectOrig.alias}</span>
              </p>
              {/* Add any other details from RedirectOrig as necessary */}
            </div>
          )}
          {UrlAnalytics && (
            <div className="mt-6 p-6 bg-white shadow-lg rounded-lg border border-gray-300">
              <h3 className="text-2xl font-semibold text-gray-800">
                UrlAnalytics
              </h3>
              <p className="text-sm text-gray-600">
                <strong>Total Clicks:</strong>{" "}
                <span className="font-semibold">
                  {UrlAnalytics.totalClicks}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                <strong>Unique Users:</strong>{" "}
                <span className="font-semibold">
                  {UrlAnalytics.uniqueUsers}
                </span>
              </p>

              {/* Clicks by Date */}
              {UrlAnalytics.clicksByDate &&
                UrlAnalytics.clicksByDate.length > 0 && (
                  <div>
                    <h4 className="text-xl font-semibold text-gray-700">
                      Clicks by Date
                    </h4>
                    <ul>
                      {UrlAnalytics.clicksByDate.map((data, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {data.date}
                          <span className="font-semibold">{data.clicks}</span>{" "}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* OS Type Analytics */}
              {UrlAnalytics.osType && UrlAnalytics.osType.length > 0 && (
                <div>
                  <h4 className="text-xl font-semibold text-gray-700">
                    Operating System Analytics
                  </h4>
                  <ul>
                    {UrlAnalytics.osType.map((data, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {data.osName}
                        <span className="font-semibold">{data.count}</span>{" "}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Device Type Analytics */}
              {UrlAnalytics.deviceType &&
                UrlAnalytics.deviceType.length > 0 && (
                  <div>
                    <h4 className="text-xl font-semibold text-gray-700">
                      Device Type Analytics
                    </h4>
                    <ul>
                      {UrlAnalytics.deviceType.map((data, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {data.deviceName}
                          <span className="font-semibold">{data.count}</span>{" "}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Add any other details from UrlAnalytics as necessary */}
            </div>
          )}
        </ul>
      </div>

      {/* Overall Analytics */}
      <div className="bg-white shadow-lg rounded-lg p-8 space-y-6 border border-gray-300">
        <h2 className="text-3xl font-semibold text-gray-800">
          Overall Analytics
        </h2>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Total URLs:{" "}
            <span className="font-semibold">
              {overallAnalytics.totalUrls || 0}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Total Clicks:{" "}
            <span className="font-semibold">
              {overallAnalytics.totalClicks || 0}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Unique Users:{" "}
            <span className="font-semibold">
              {overallAnalytics.uniqueUsers || 0}
            </span>
          </p>
        </div>
      </div>

      {/* Topic Analytics */}
      <div className="bg-white shadow-lg rounded-lg p-8 space-y-6 border border-gray-300">
        <h2 className="text-3xl font-semibold text-gray-800">
          Analytics by Topic
        </h2>
        <div className="space-y-4">
          <ul>
            {userUrls.map(
              (url) =>
                url.topic && (
                  <li
                    key={url.userId}
                    className="cursor-pointer text-blue-600 hover:underline"
                    onClick={() => handleTopicClick(url.topic)}
                  >
                    {url.topic}
                  </li>
                )
            )}
          </ul>
          {selectedTopicUrls.length > 0 && (
            <>
              <ul>
                {selectedTopicUrls.map((url) => (
                  <li
                    key={url._id}
                    className="flex justify-between items-center p-4 border-b border-gray-200"
                  >
                    <span className="text-gray-700 text-sm">
                      {url.shortUrl}
                    </span>
                    <p className="text-sm text-gray-600">
                      Total Clicks:{" "}
                      <span className="font-semibold">
                        {url.totalClicks || 0}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Unique Users:{" "}
                      <span className="font-semibold">
                        {url.uniqueUsers || 0}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
