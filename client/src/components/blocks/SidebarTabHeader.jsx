import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import logo from "../../assets/raglogo.png";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext.jsx";
import { useContext } from "react";
import { Loader2 } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const SidebarTabHeader = () => {
  const navigate = useNavigate();
  const [yLink, setYLink] = useState("");
  const [websiteLnk, setWebsiteLink] = useState("");
  const [loadingLink, setLoadingLink] = useState(false);
  const [linkError, setLinkError] = useState("");
  const { setCurrentContext } = useContext(AppContext);

  const handleYoutubeLink = async () => {
    setLinkError("");
    try {
      setLoadingLink(true);
      if (!yLink || !yLink.trim()) {
        setLoadingLink(false);
        return;
      }
      const res = await fetch(`${API_BASE_URL}/api/youtubelink`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtubeLink: yLink }),
      });
      const data = await res.json();
      setLoadingLink(false);
      if (res.ok) {
        const title =
          data?.data?.[0]?.metadata?.title ||
          data?.data?.[0]?.metadata?.videoId ||
          "YouTube video";
        setCurrentContext((prev) => [...prev, title]);
        setYLink("");
      } else {
        setLinkError(data?.message || data?.error || "YouTube failed");
      }
    } catch (error) {
      setLoadingLink(false);
      setLinkError(error.message || "Network error");
    }
  };

  const handleWebsiteLink = async () => {
    setLinkError("");
    try {
      setLoadingLink(true);
      if (!websiteLnk || !websiteLnk.trim()) {
        setLoadingLink(false);
        return;
      }
      const res = await fetch(`${API_BASE_URL}/api/websitelink`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteLnk: websiteLnk.trim() }),
      });
      const data = await res.json();
      setLoadingLink(false);
      if (res.ok && data.success) {
        setCurrentContext((prev) => [...prev, data.websiteName || websiteLnk]);
        setWebsiteLink("");
      } else {
        setLinkError(data?.message || data?.error || "Website failed");
      }
    } catch (error) {
      setLoadingLink(false);
      setLinkError(error.message || "Network error");
    }
  };
  return (
    <div className="min-h-[30vh] mx-3 ">
      <div className="flex items-center  justify-between">
        <img src={logo} alt="logo" className="w-[80%]" />
        <FaArrowLeft className="cursor-pointer" onClick={() => navigate("/")} />
      </div>

      <Tabs defaultValue="youtube">
        <TabsList className="w-[100%]  ">
          <TabsTrigger value="youtube">YouTube</TabsTrigger>
          <TabsTrigger value="website">Website</TabsTrigger>
        </TabsList>

        <TabsContent value="youtube">
          <Card className="p-4">
            <Input
              placeholder="Enter YouTube link"
              value={yLink}
              onChange={(e) => {
                setYLink(e.target.value);
                setLinkError("");
              }}
            />
            {linkError && (
              <p className="text-xs text-red-500 mt-1">{linkError}</p>
            )}
            {loadingLink ? (
              <Button
                className="cursor-pointer flex justify-center mt-2"
                disabled
              >
                <Loader2 className="animate-spin text-white" size={16} /> OK
              </Button>
            ) : (
              <Button
                className="cursor-pointer flex justify-center mt-2"
                onClick={handleYoutubeLink}
              >
                OK
              </Button>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="website">
          <Card className="p-4">
            <Input
              placeholder="Enter website link"
              value={websiteLnk}
              onChange={(e) => {
                setWebsiteLink(e.target.value);
                setLinkError("");
              }}
            />
            {linkError && (
              <p className="text-xs text-red-500 mt-1">{linkError}</p>
            )}
            {loadingLink ? (
              <Button
                className="cursor-pointer flex justify-center mt-2"
                disabled
              >
                <Loader2 className="animate-spin text-white" size={16} /> OK
              </Button>
            ) : (
              <Button
                className="cursor-pointer flex justify-center mt-2"
                onClick={handleWebsiteLink}
              >
                OK
              </Button>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SidebarTabHeader;
