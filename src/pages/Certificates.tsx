
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Button } from "@/components/ui/button";
import { Award, Calendar, Download, Share2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Certificates = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for certificates
  const allCertificates = [
    {
      id: "1",
      title: "Introduction to TypeScript",
      issueDate: new Date(2024, 5, 20),
      expiryDate: null, // null means it doesn't expire
      image: "/lovable-uploads/9ef64252-f03e-4682-9aa3-2f2877a7d64f.png",
      credentialId: "TS-2024-05-789456",
      skills: ["TypeScript", "JavaScript", "Static Typing"],
    },
    {
      id: "2",
      title: "CSS Animations and Transitions",
      issueDate: new Date(2024, 4, 12),
      expiryDate: null,
      image: "/lovable-uploads/9ef64252-f03e-4682-9aa3-2f2877a7d64f.png",
      credentialId: "CSS-2024-04-567890",
      skills: ["CSS", "Animations", "Web Design"],
    },
    {
      id: "3",
      title: "Frontend Web Development",
      issueDate: new Date(2024, 3, 5),
      expiryDate: new Date(2026, 3, 5),
      image: "/lovable-uploads/9ef64252-f03e-4682-9aa3-2f2877a7d64f.png",
      credentialId: "FE-2024-03-123456",
      skills: ["HTML", "CSS", "JavaScript", "React"],
    },
  ];

  // Filter certificates based on search query
  const filteredCertificates = allCertificates.filter((certificate) =>
    certificate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    certificate.credentialId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    certificate.skills.some((skill) => 
      skill.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Handle certificate download
  const handleDownload = (certificateId: string) => {
    toast.success("Certificate download started");
  };

  // Handle certificate sharing
  const handleShare = (certificateId: string) => {
    toast.success("Certificate sharing options opened");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="My Certificates" 
        description="View and download your earned certificates"
      >
        <div className="relative w-full md:w-[260px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search certificates..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </PageHeader>

      {filteredCertificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCertificates.map((certificate) => (
            <DashboardCard key={certificate.id} className="overflow-hidden">
              <div className="relative">
                <div className="aspect-[1.4/1] overflow-hidden rounded-lg bg-muted mb-4">
                  <img
                    src={certificate.image}
                    alt={certificate.title}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Award size={18} className="text-codespring-green-500" />
                      <h3 className="font-semibold text-lg">{certificate.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {certificate.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="font-normal">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Issued On</p>
                      <p className="font-medium">
                        <Calendar size={14} className="inline mr-1" />
                        {format(certificate.issueDate, "MMMM d, yyyy")}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Credential ID</p>
                      <p className="font-medium">{certificate.credentialId}</p>
                    </div>
                    {certificate.expiryDate && (
                      <div>
                        <p className="text-muted-foreground">Expires On</p>
                        <p className="font-medium">
                          <Calendar size={14} className="inline mr-1" />
                          {format(certificate.expiryDate, "MMMM d, yyyy")}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      className="flex-1 gap-2" 
                      onClick={() => handleDownload(certificate.id)}
                    >
                      <Download size={16} />
                      <span>Download</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="gap-2" 
                      onClick={() => handleShare(certificate.id)}
                    >
                      <Share2 size={16} />
                      <span>Share</span>
                    </Button>
                  </div>
                </div>
              </div>
            </DashboardCard>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <Award size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium">No certificates found</h3>
          {searchQuery ? (
            <p className="text-muted-foreground mt-1">
              Try adjusting your search query
            </p>
          ) : (
            <p className="text-muted-foreground mt-1">
              Complete courses to earn certificates
            </p>
          )}
          <Button className="mt-4" variant="outline">
            Browse Courses
          </Button>
        </div>
      )}
    </div>
  );
};

export default Certificates;
