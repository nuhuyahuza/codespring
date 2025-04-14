
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, MessageSquare, PhoneCall, Mail } from "lucide-react";

export default function Support() {
  return (
    <div className="container mx-auto space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
      </div>

      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 mb-6">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions about our platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I submit an assignment?</AccordionTrigger>
                  <AccordionContent>
                    To submit an assignment, navigate to the Assignments page, find the assignment you want to submit, click on it to open the details, and use the "Submit Assignment" button to upload your files and submit your work.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I join a live class?</AccordionTrigger>
                  <AccordionContent>
                    To join a live class, go to the Live Classes page, find the class you want to join, and click the "Join Class" button a few minutes before the scheduled start time. Make sure your camera and microphone are working properly for the best experience.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How can I download my certificates?</AccordionTrigger>
                  <AccordionContent>
                    After completing a course, certificates are automatically generated and available on the Certificates page. Click on the certificate you want, and use the "Download" button to save a PDF copy to your device. You can also share your certificates directly to social media platforms.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>How do I update my profile information?</AccordionTrigger>
                  <AccordionContent>
                    To update your profile information, go to the Profile page, where you can edit your personal details, change your password, upload a profile picture, and adjust your notification preferences. Don't forget to click the "Save Changes" button after making your updates.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>What should I do if I'm having technical issues?</AccordionTrigger>
                  <AccordionContent>
                    If you're experiencing technical issues, first try refreshing the page or using a different browser. If the problem persists, go to the Support page and submit a ticket describing your issue in detail. Our technical team will respond as soon as possible. For immediate assistance, you can use the live chat feature during business hours.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger>How do I join a community group?</AccordionTrigger>
                  <AccordionContent>
                    To join a community group, navigate to the Community Groups page, browse the available groups, and click the "Join Group" button next to the group you're interested in. Once joined, you'll have access to all discussions and resources shared within that group.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-2">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Live Chat</CardTitle>
                <CardDescription>Get instant help from our support team</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full">Start Chat</Button>
              </CardFooter>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-2">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Email Support</CardTitle>
                <CardDescription>Send us a message anytime</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" className="w-full">support@codespring.edu</Button>
              </CardFooter>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-2">
                  <PhoneCall className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Phone Support</CardTitle>
                <CardDescription>Available Mon-Fri, 9AM-5PM</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" className="w-full">+1 (555) 123-4567</Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Contact Form</CardTitle>
              <CardDescription>Send us a message and we'll get back to you as soon as possible</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Your email" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Subject of your message" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <textarea 
                    id="message" 
                    className="flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Describe your issue or question in detail"
                  />
                </div>
                
                <Button type="submit" className="w-full md:w-auto">Submit Request</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Help Center</CardTitle>
              <CardDescription>Comprehensive guides and tutorials for Codespring</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Getting Started Guide</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">Learn the basics of navigating the Codespring platform</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button variant="outline" size="sm">View Guide</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Video Tutorials</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">Watch step-by-step tutorial videos for common tasks</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button variant="outline" size="sm">View Tutorials</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Troubleshooting</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">Solutions to common technical issues and problems</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button variant="outline" size="sm">View Solutions</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Community Forums</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">Connect with other students to discuss and solve problems</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button variant="outline" size="sm">Visit Forums</Button>
                </CardFooter>
              </Card>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
              <CardDescription>Helpful links and downloads</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  <span>Student Handbook</span>
                </div>
                <Button variant="ghost" size="sm">Download PDF</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  <span>System Requirements</span>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  <span>Platform Updates</span>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  <span>Browser Extensions</span>
                </div>
                <Button variant="ghost" size="sm">Download</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
