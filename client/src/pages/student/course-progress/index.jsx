import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "@/services";
import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);

  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const { id } = useParams();

  // 1. FETCH PROGRESS
  async function fetchCurrentCourseProgress() {
    try {
      const response = await getCurrentCourseProgressService(auth?.user?._id, id);

      if (response?.success) {
        if (!response?.data?.isPurchased) {
          setLockCourse(true);
          return;
        }

        // Standardize progress array (handle if it's nested in lecturesProgress)
        const progressArray = response?.data?.progress?.lecturesProgress || response?.data?.progress || [];

        setStudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: progressArray, // Save just the array for easier checking
        });

        // Check if completed
        if (response?.data?.progress?.completed) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);
          return;
        }

        // Find where to resume (Last viewed + 1)
        if (progressArray.length === 0) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
        } else {
          // Find the last lecture that was marked "viewed: true"
          const lastIndexOfViewedAsTrue = progressArray.reduceRight(
            (acc, obj, index) => {
              return acc === -1 && obj.viewed ? index : acc;
            },
            -1
          );

          // If all viewed, or none, handle accordingly
          const nextIndex = lastIndexOfViewedAsTrue + 1;
          const nextLecture = response?.data?.courseDetails?.curriculum[nextIndex]
            || response?.data?.courseDetails?.curriculum[0];

          setCurrentLecture(nextLecture);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  // 2. UPDATE PROGRESS (Called by VideoPlayer)
  async function updateCourseProgress() {
    if (currentLecture) {
      const response = await markLectureAsViewedService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture._id
      );

      if (response?.success) {
        fetchCurrentCourseProgress();
      }
    }
  }

  // 3. REWATCH
  async function handleRewatchCourse() {
    const response = await resetCourseProgressService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id
    );

    if (response?.success) {
      setCurrentLecture(studentCurrentCourseProgress?.courseDetails?.curriculum[0]);
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      fetchCurrentCourseProgress();
    }
  }

  useEffect(() => {
    if (auth?.user?._id) fetchCurrentCourseProgress();
  }, [auth, id]);

  // Hook to detect when VideoPlayer reports "progressValue === 1" (Done)
  useEffect(() => {
    if (currentLecture?.progressValue === 1) updateCourseProgress();
  }, [currentLecture]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
  }, [showConfetti]);


  return (
    <div className="flex flex-col h-screen bg-[#1c1d1f] text-white">
      {showConfetti && <Confetti />}

      {/* HEADER */}
      <div className="flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/student-courses")}
            className="text-white hover:text-gray-300"
            variant="ghost"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to My Courses
          </Button>
          <h1 className="text-lg font-bold hidden md:block text-gray-200">
            {studentCurrentCourseProgress?.courseDetails?.title}
          </h1>
        </div>
        <Button onClick={() => setIsSideBarOpen(!isSideBarOpen)} variant="ghost" className="text-white">
          {isSideBarOpen ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* VIDEO PLAYER AREA */}
        <div
          className={`flex-1 flex flex-col ${isSideBarOpen ? "mr-[400px]" : ""
            } transition-all duration-300`}
        >
          <div className="flex-1 bg-black flex items-center justify-center">
            <VideoPlayer
              width="100%"
              height="100%"
              url={currentLecture?.videoUrl}
              onProgressUpdate={setCurrentLecture}
              progressData={currentLecture}
            />
          </div>
          <div className="p-6 bg-[#1c1d1f] border-t border-gray-800">
            <h2 className="text-2xl font-bold mb-2">{currentLecture?.title}</h2>
          </div>
        </div>

        {/* SIDEBAR */}
        <div
          className={`fixed top-[64px] right-0 bottom-0 w-[400px] bg-[#1c1d1f] border-l border-gray-700 transition-transform duration-300 z-10 ${isSideBarOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <Tabs defaultValue="content" className="h-full flex flex-col">
            <TabsList className="grid bg-[#1c1d1f] w-full grid-cols-2 p-0 h-14 border-b border-gray-700">
              <TabsTrigger value="content" className="text-white data-[state=active]:bg-gray-800 rounded-none h-full">
                Course Content
              </TabsTrigger>
              <TabsTrigger value="overview" className="text-white data-[state=active]:bg-gray-800 rounded-none h-full">
                Overview
              </TabsTrigger>
            </TabsList>

            {/* CURRICULUM LIST */}
            <TabsContent value="content" className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full">
                <div className="p-0">
                  {studentCurrentCourseProgress?.courseDetails?.curriculum.map((item) => {
                    // Check if this specific item is completed
                    const isCompleted = studentCurrentCourseProgress?.progress?.find(
                      (p) => p.lectureId === item._id && p.viewed
                    );
                    const isCurrent = currentLecture?._id === item._id;

                    return (
                      <div
                        key={item._id}
                        onClick={() => setCurrentLecture(item)} // --- FIXED: CLICK TO SWITCH ---
                        className={`flex items-center space-x-3 p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors ${isCurrent ? "bg-gray-800 border-l-4 border-l-green-500" : ""
                          }`}
                      >
                        {isCompleted ? (
                          <Check className="h-5 w-5 text-green-500 shrink-0" />
                        ) : (
                          <Play className={`h-4 w-4 shrink-0 ${isCurrent ? "text-white" : "text-gray-500"}`} />
                        )}
                        <span className={`text-sm font-medium ${isCurrent ? "text-white" : "text-gray-400"}`}>
                          {item.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="overview" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">About this course</h2>
                  <p className="text-gray-400 leading-relaxed">
                    {studentCurrentCourseProgress?.courseDetails?.description}
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* DIALOGS */}
      <Dialog open={lockCourse} onOpenChange={() => navigate('/student-courses')}>
        <DialogContent className="sm:w-[425px] bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Access Restricted</DialogTitle>
            <DialogDescription className="text-gray-400">
              Please purchase this course to view the content.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showCourseCompleteDialog} onOpenChange={setShowCourseCompleteDialog}>
        <DialogContent showOverlay={true} className="sm:w-[425px] bg-white text-black">
          <DialogHeader>
            <DialogTitle>🎉 Congratulations!</DialogTitle>
            <DialogDescription className="flex flex-col gap-4 pt-4">
              <Label className="text-center text-lg">You have completed the course!</Label>
              <div className="flex flex-row gap-3 justify-center">
                <Button onClick={() => navigate("/student-courses")} variant="default">
                  My Courses
                </Button>
                <Button onClick={handleRewatchCourse} variant="outline">
                  Rewatch
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseProgressPage;