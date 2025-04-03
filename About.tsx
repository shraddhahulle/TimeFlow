
import { useNavigate } from "react-router-dom";
import LandingHeader from "@/components/LandingHeader";
import LandingFooter from "@/components/LandingFooter";
import { Button } from "@/components/ui/button";

const About = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-timeflow-dark">
      <LandingHeader />
      
      <main className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">About TimeFlow</h1>
          
          <div className="space-y-6 text-gray-300">
            <p>
              TimeFlow was founded in 2023 with a clear mission: to revolutionize how project managers and teams plan, 
              track, and execute their projects. We identified a common pain point in the industry—the time-consuming 
              and often inaccurate process of manual timeline planning.
            </p>
            
            <p>
              Our team of AI specialists, project management experts, and software developers came together to create 
              a solution that leverages the power of artificial intelligence to automate and optimize the project 
              planning process.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Our Mission</h2>
            
            <p>
              At TimeFlow, our mission is to eliminate the manual effort of planning timelines and ensure efficient 
              project tracking, allowing teams to focus on what matters most: delivering successful projects.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Our Vision</h2>
            
            <p>
              We envision a future where AI-powered tools like TimeFlow become an indispensable part of every project 
              manager's toolkit, enabling more accurate planning, better resource allocation, and higher project 
              success rates across industries.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Our Team</h2>
            
            <p>
              TimeFlow is powered by a diverse team of professionals who are passionate about project management, 
              artificial intelligence, and creating software that makes a difference. Our team members bring 
              experience from leading tech companies and a deep understanding of the challenges faced by 
              project managers in various industries.
            </p>
            
            <div className="mt-10 text-center">
              <Button 
                onClick={() => navigate("/")} 
                className="bg-timeflow-primary hover:bg-timeflow-primary/90 text-black font-semibold"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <LandingFooter />
    </div>
  );
};

export default About;
