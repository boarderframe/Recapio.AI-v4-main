import React, { useState, useRef, useEffect } from "react";
import { FiMaximize2, FiPlus, FiBook, FiTag, FiMessageCircle, FiChevronLeft, FiChevronRight, FiPlay, FiPause, FiRefreshCw, FiShuffle, FiSkipBack, FiSkipForward, FiVolume2, FiVolumeX, FiAward, FiBarChart2, FiCpu, FiDatabase, FiGlobe, FiHeart, FiLayers, FiTrendingUp, FiZap, FiTarget, FiInfo, FiClock, FiFilter, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const dummyData = [
  {
    id: 1,
    type: "Key Summary",
    content: "AI technology is revolutionizing healthcare through early disease detection and personalized treatment plans.",
    color: "bg-gradient-to-br from-purple-600 to-blue-600",
    icon: "summary",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800"
  },
  {
    id: 2,
    type: "Main Themes",
    content: ["AI Ethics", "Healthcare Innovation", "Patient Care", "Data Privacy", "Medical Research"],
    color: "bg-gradient-to-br from-green-600 to-teal-600",
    icon: "themes",
    image: "https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&w=800"
  },
  {
    id: 3,
    type: "Notable Quote",
    content: "The future of healthcare lies at the intersection of human expertise and artificial intelligence.",
    color: "bg-gradient-to-br from-red-600 to-pink-600",
    icon: "quote",
    image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800"
  },
  {
    id: 4,
    type: "Key Statistics",
    content: ["85% accuracy in diagnosis", "50% reduction in wait times", "30% cost savings", "2x faster research"],
    color: "bg-gradient-to-br from-yellow-600 to-orange-600",
    icon: "chart",
    image: "https://images.unsplash.com/photo-1576670159147-042c8d6272c0?auto=format&fit=crop&w=800"
  },
  {
    id: 5,
    type: "Future Implications",
    content: "Integration of AI in healthcare will lead to more precise, personalized, and preventive medical care.",
    color: "bg-gradient-to-br from-indigo-600 to-purple-600",
    icon: "trending",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800"
  }
];

const cardTypes = [
  {
    type: "Key Summary",
    icon: "summary",
    color: "bg-gradient-to-br from-purple-600 to-blue-600"
  },
  {
    type: "Main Themes",
    icon: "themes",
    color: "bg-gradient-to-br from-green-600 to-teal-600"
  },
  {
    type: "Notable Quote",
    icon: "quote",
    color: "bg-gradient-to-br from-red-600 to-pink-600"
  },
  {
    type: "Key Statistics",
    icon: "chart",
    color: "bg-gradient-to-br from-yellow-600 to-orange-600"
  },
  {
    type: "Future Implications",
    icon: "trending",
    color: "bg-gradient-to-br from-indigo-600 to-purple-600"
  }
];

const Dashboard = () => {
  const [summaries, setSummaries] = useState(dummyData);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [selectedForDashboard, setSelectedForDashboard] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(5000);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [visibleCards, setVisibleCards] = useState(dummyData.map(card => card.id));
  const [streamInfo, setStreamInfo] = useState({
    totalDuration: "45 mins",
    currentTime: "00:00",
    category: "AI & Healthcare",
    viewCount: 1234
  });
  
  const scrollRef = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    if (isPlaying && scrollRef.current) {
      const animate = async () => {
        await controls.start({
          x: -((400 + 24) * (summaries.length - 1)),
          transition: {
            duration: (scrollSpeed / 1000) * summaries.length,
            ease: "linear"
          }
        });

        if (isLooping) {
          controls.set({ x: 0 });
          animate();
        } else {
          setIsPlaying(false);
        }
      };

      animate();
    } else {
      controls.stop();
    }

    return () => {
      controls.stop();
    };
  }, [isPlaying, scrollSpeed, isLooping, controls, summaries.length]);

  const handleRemove = (id) => {
    setSummaries(summaries.filter((summary) => summary.id !== id));
  };

  const handleExpand = (summary) => {
    setSelectedCard(summary);
    setIsModalOpen(true);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(summaries);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSummaries(items);
  };

  const toggleCardVisibility = (id) => {
    setVisibleCards(prev => {
      if (prev.includes(id)) {
        return prev.filter(cardId => cardId !== id);
      }
      return [...prev, id];
    });
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      const newScrollPosition = direction === "left" 
        ? Math.max(0, currentIndex - 1)
        : Math.min(summaries.length - 1, currentIndex + 1);
      
      setCurrentIndex(newScrollPosition);
      controls.start({
        x: -(scrollAmount + 24) * newScrollPosition,
        transition: { duration: 0.5, ease: "easeInOut" }
      });
    }
  };

  const handleShuffle = () => {
    if (isShuffle) {
      setSummaries([...dummyData]);
    } else {
      setSummaries([...summaries].sort(() => Math.random() - 0.5));
    }
    setIsShuffle(!isShuffle);
  };

  const handleSkip = (direction) => {
    const newIndex = direction === "forward" 
      ? Math.min(currentIndex + 1, summaries.length - 1)
      : Math.max(currentIndex - 1, 0);
    setCurrentIndex(newIndex);
    controls.start({
      x: -((400 + 24) * newIndex),
      transition: { duration: 0.5, ease: "easeInOut" }
    });
  };

  const handleReset = () => {
    setCurrentIndex(0);
    controls.start({
      x: 0,
      transition: { duration: 0.5, ease: "easeInOut" }
    });
  };

  const toggleDashboardSelection = (id) => {
    setSelectedForDashboard(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      }
      return [...prev, id];
    });
  };

  const getIcon = (type) => {
    switch(type) {
      case "summary": return <FiBook className="w-6 h-6" />;
      case "themes": return <FiTag className="w-6 h-6" />;
      case "quote": return <FiMessageCircle className="w-6 h-6" />;
      case "globe": return <FiGlobe className="w-6 h-6" />;
      case "chart": return <FiBarChart2 className="w-6 h-6" />;
      case "trending": return <FiTrendingUp className="w-6 h-6" />;
      case "target": return <FiTarget className="w-6 h-6" />;
      case "heart": return <FiHeart className="w-6 h-6" />;
      case "database": return <FiDatabase className="w-6 h-6" />;
      case "award": return <FiAward className="w-6 h-6" />;
      case "cpu": return <FiCpu className="w-6 h-6" />;
      case "layers": return <FiLayers className="w-6 h-6" />;
      case "zap": return <FiZap className="w-6 h-6" />;
      default: return <FiBook className="w-6 h-6" />;
    }
  };

  const renderCardSelectionModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl p-6 max-w-4xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Manage Cards</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-white hover:text-gray-300"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="cards">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {summaries.map((card, index) => (
                  <Draggable
                    key={card.id}
                    draggableId={String(card.id)}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${card.color} rounded-lg p-4 flex justify-between items-center transition-all cursor-move`}
                      >
                        <div className="flex items-center gap-3 text-white">
                          {getIcon(card.icon)}
                          <h3 className="font-semibold">{card.type}</h3>
                        </div>
                        <button
                          onClick={() => toggleCardVisibility(card.id)}
                          className={`p-2 ${visibleCards.includes(card.id) ? "bg-green-500" : "bg-white/10"} rounded-full transition-colors`}
                        >
                          {visibleCards.includes(card.id) ? (
                            <FiCheck className="w-5 h-5 text-white" />
                          ) : (
                            <FiX className="w-5 h-5 text-white" />
                          )}
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );

  const filteredSummaries = summaries.filter(summary => visibleCards.includes(summary.id));

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10 px-4 py-4 border-b border-gray-800">
          <div className="flex items-center gap-6">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <div className="flex items-center gap-4 text-gray-400">
              <div className="flex items-center gap-2">
                <FiClock className="w-4 h-4" />
                <span>{streamInfo.totalDuration}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiFilter className="w-4 h-4" />
                <span>{streamInfo.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiInfo className="w-4 h-4" />
                <span>{streamInfo.viewCount} views</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDashboardOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FiMaximize2 className="w-4 h-4" />
              Summary Dashboard
            </button>
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              title="Select card templates to add to stream"
            >
              <FiPlus className="w-4 h-4" />
              Manage Cards
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-gray-800/80 p-3 rounded-full hover:bg-gray-700 transition-colors text-white"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-gray-800/80 p-3 rounded-full hover:bg-gray-700 transition-colors text-white"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>

          <motion.div 
            ref={scrollRef} 
            className="flex gap-6 pb-4 px-4 snap-x snap-mandatory hide-scrollbar"
            animate={controls}
          >
            {filteredSummaries.map((summary) => (
              <motion.div
                key={summary.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`${summary.color} rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 min-w-[400px] max-w-[400px] h-[500px] flex-shrink-0 relative snap-center transform hover:scale-105`}
              >
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <button
                    onClick={() => toggleDashboardSelection(summary.id)}
                    className={`p-2 ${selectedForDashboard.includes(summary.id) ? "bg-green-500" : "bg-white/10"} hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm`}
                  >
                    {selectedForDashboard.includes(summary.id) ? (
                      <FiCheck className="w-5 h-5 text-white" />
                    ) : (
                      <FiPlus className="w-5 h-5 text-white" />
                    )}
                  </button>
                  <button
                    onClick={() => handleExpand(summary)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
                  >
                    <FiMaximize2 className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={() => handleRemove(summary.id)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
                  >
                    <FiTrash2 className="w-5 h-5 text-white" />
                  </button>
                </div>
                <img 
                  src={summary.image} 
                  alt={summary.type}
                  className="w-full h-1/2 object-cover"
                />
                <div className="p-6 relative">
                  <div className="absolute -top-8 left-6 bg-white p-3 rounded-full shadow-lg">
                    {getIcon(summary.icon)}
                  </div>
                  <h2 className="text-xl font-bold text-white mt-4 mb-4">{summary.type}</h2>
                  {Array.isArray(summary.content) ? (
                    <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto">
                      {summary.content.map((item, index) => (
                        <span key={index} className="px-3 py-1 bg-white/20 text-white rounded-full text-sm whitespace-nowrap">
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/90 line-clamp-4">{summary.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800/90 rounded-2xl p-6 backdrop-blur-sm flex flex-col gap-4 z-50 min-w-[400px]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <FiVolumeX className="w-5 h-5 text-white" />
                ) : (
                  <FiVolume2 className="w-5 h-5 text-white" />
                )}
              </button>
              <button
                onClick={handleReset}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                title="Reset"
              >
                <FiRefreshCw className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSkip("back")}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                title="Previous"
              >
                <FiSkipBack className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <FiPause className="w-6 h-6 text-white" />
                ) : (
                  <FiPlay className="w-6 h-6 text-white" />
                )}
              </button>
              <button
                onClick={() => handleSkip("forward")}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                title="Next"
              >
                <FiSkipForward className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLooping(!isLooping)}
                className={`p-2 ${isLooping ? "bg-white/30" : "bg-white/10"} hover:bg-white/20 rounded-full transition-colors`}
                title="Loop"
              >
                <FiRefreshCw className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={handleShuffle}
                className={`p-2 ${isShuffle ? "bg-white/30" : "bg-white/10"} hover:bg-white/20 rounded-full transition-colors`}
                title="Shuffle"
              >
                <FiShuffle className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-white text-sm">Speed:</span>
            <input
              type="range"
              min="1000"
              max="10000"
              step="1000"
              value={scrollSpeed}
              onChange={(e) => setScrollSpeed(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-white text-sm">{scrollSpeed/1000}s</span>
          </div>

          <div className="flex justify-between items-center text-white/60 text-sm">
            <span>Card {currentIndex + 1} of {filteredSummaries.length}</span>
            <div className="flex items-center gap-2">
              <span>{isLooping ? "Loop On" : "Loop Off"}</span>
              <span>•</span>
              <span>{isShuffle ? "Shuffle On" : "Shuffle Off"}</span>
            </div>
          </div>
        </div>

        {isDashboardOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-xl p-6 max-w-6xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Summary Dashboard</h2>
                <button
                  onClick={() => setIsDashboardOpen(false)}
                  className="text-white hover:text-gray-300"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {summaries
                  .filter(summary => selectedForDashboard.includes(summary.id))
                  .map(summary => (
                    <motion.div
                      key={summary.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`${summary.color} rounded-xl shadow-lg overflow-hidden transition-all duration-300`}
                    >
                      <img 
                        src={summary.image} 
                        alt={summary.type}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-4 relative">
                        <div className="absolute -top-6 left-4 bg-white p-2 rounded-full shadow-lg">
                          {getIcon(summary.icon)}
                        </div>
                        <h3 className="text-lg font-semibold text-white mt-2 mb-2">{summary.type}</h3>
                        {Array.isArray(summary.content) ? (
                          <div className="flex flex-wrap gap-2">
                            {summary.content.map((item, index) => (
                              <span key={index} className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">
                                {item}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-white/90 text-sm">{summary.content}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {isModalOpen && renderCardSelectionModal()}

        <style jsx>{`
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Dashboard;