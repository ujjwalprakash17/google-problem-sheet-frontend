import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Circle,
  BookOpen,
  Trophy,
  Target,
  Flame,
  Search,
  Filter,
  X,
  Calendar,
  Clock,
  BarChart3,
  Star,
  Zap,
  TrendingUp,
  ChevronDown,
  ExternalLink,
  Bookmark,
  Lightbulb,
} from "lucide-react";

import { problemList } from "../helper/ProblemList";
import type { Problem, ProblemStats } from "../interfaces/Types";



interface Notes {
  [key: string]: string;
}

const ProblemList: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [notes, setNotes] = useState<Notes>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expandedDay, setExpandedDay] = useState<string | null>("Day 1");
  const [activeWeek, setActiveWeek] = useState<number>(1);

  useEffect(() => {
    const storedProblems = localStorage.getItem("dsa_progress");
    const storedNotes = localStorage.getItem("dsa_notes");

    if (storedProblems) {
      setProblems(JSON.parse(storedProblems));
    } else {
      const initialProblems: Problem[] = problemList.map((problem) => ({
        ...problem,
        completed: false,
        completedDate: null,
      }));
      setProblems(initialProblems);
    }

    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  useEffect(() => {
    if (problems.length > 0) {
      localStorage.setItem("dsa_progress", JSON.stringify(problems));
    }
  }, [problems]);

  useEffect(() => {
    localStorage.setItem("dsa_notes", JSON.stringify(notes));
  }, [notes]);

  const toggleProblemCompletion = (problemId: string): void => {
    setProblems((prev) =>
      prev.map((problem) =>
        problem.title === problemId
          ? {
              ...problem,
              completed: !problem.completed,
              completedDate: !problem.completed
                ? new Date().toISOString()
                : null,
            }
          : problem
      )
    );
  };

  const updateNotes = (problemId: string, newNotes: string): void => {
    setNotes((prev) => ({
      ...prev,
      [problemId]: newNotes,
    }));
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case "Easy":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "Medium":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "Hard":
        return "text-rose-600 bg-rose-50 border-rose-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStats = (): ProblemStats => {
    const total = problems.length;
    const completed = problems.filter((p) => p.completed).length;
    const easy = problems.filter((p) => p.difficulty === "Easy").length;
    const medium = problems.filter((p) => p.difficulty === "Medium").length;
    const hard = problems.filter((p) => p.difficulty === "Hard").length;
    const easyCompleted = problems.filter(
      (p) => p.difficulty === "Easy" && p.completed
    ).length;
    const mediumCompleted = problems.filter(
      (p) => p.difficulty === "Medium" && p.completed
    ).length;
    const hardCompleted = problems.filter(
      (p) => p.difficulty === "Hard" && p.completed
    ).length;

    // Calculate streak (consecutive days with at least one problem solved)
    const completedDates = problems
      .filter((p) => p.completed && p.completedDate)
      .map((p) => new Date(p.completedDate!).toDateString());

    const uniqueDates = [...new Set(completedDates)].sort();
    let streak = 0;
    let currentStreak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
      } else {
        streak = Math.max(streak, currentStreak);
        currentStreak = 1;
      }
    }
    streak = Math.max(streak, currentStreak);

    return {
      total,
      completed,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0,
      easy: { total: easy, completed: easyCompleted },
      medium: { total: medium, completed: mediumCompleted },
      hard: { total: hard, completed: hardCompleted },
      streak,
    };
  };

  const filteredProblems = problems.filter((problem) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && problem.completed) ||
      (filter === "pending" && !problem.completed) ||
      problem.difficulty.toLowerCase() === filter;

    const matchesSearch =
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.technique.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const stats = getStats();

  // Group problems by day and filter by active week
  const problemsByDay: { [key: string]: Problem[] } = filteredProblems
    .filter((problem) => problem.week === activeWeek)
    .reduce((acc, problem) => {
      const dayKey = `Day ${problem.day}`;
      if (!acc[dayKey]) {
        acc[dayKey] = [];
      }
      acc[dayKey].push(problem);
      return acc;
    }, {} as { [key: string]: Problem[] });
  const weeks = Array.from(new Set(problems.map((p) => p.week)));

  return (
    <div className="min-h-screen gradient-bg">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div
          className="absolute -bottom-40 -left-32 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 glass-effect rounded-2xl">
            <Zap className="text-yellow-500" size={28} />
            <span className="text-lg font-semibold text-gray-700">
              12-Week DSA Mastery
            </span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Problem Solving Tracker
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Track your journey through{" "}
            <span className="font-semibold text-blue-600">300+</span> carefully
            curated problems and master Data Structures & Algorithms
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
          <div className="stats-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <BookOpen className="text-blue-600" size={24} />
              </div>
              <TrendingUp
                className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                size={20}
              />
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Total Problems
            </h3>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              <div className="text-green-500 flex items-center gap-1">
                <span className="text-sm font-semibold">
                  +{stats.completed}
                </span>
              </div>
            </div>
          </div>

          <div className="stats-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle2 className="text-green-600" size={24} />
              </div>
              <BarChart3
                className="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity"
                size={20}
              />
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Completed
            </h3>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-gray-800">
                {stats.completed}
              </p>
              <span className="text-green-500 text-sm font-semibold">
                {stats.progress}%
              </span>
            </div>
          </div>

          <div className="stats-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Target className="text-purple-600" size={24} />
              </div>
              <Star
                className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
                size={20}
              />
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Progress</h3>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-gray-800">
                {stats.progress}%
              </p>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                  style={{ width: `${stats.progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="stats-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Flame className="text-orange-600" size={24} />
              </div>
              <Trophy
                className="text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"
                size={20}
              />
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Current Streak
            </h3>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-gray-800">{stats.streak}</p>
              <span className="text-orange-500 text-sm font-semibold">
                days
              </span>
            </div>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="glass-effect rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-indigo-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">
              Progress by Difficulty
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(["easy", "medium", "hard"] as const).map((diff) => (
              <div
                key={diff}
                className="bg-white/50 rounded-xl p-4 border border-gray-200/50"
              >
                <div className="flex justify-between items-center mb-3">
                  <span
                    className={`font-semibold capitalize px-3 py-1 rounded-full border text-sm ${
                      diff === "easy"
                        ? "text-emerald-600 bg-emerald-50 border-emerald-200"
                        : diff === "medium"
                        ? "text-amber-600 bg-amber-50 border-amber-200"
                        : "text-rose-600 bg-rose-50 border-rose-200"
                    }`}
                  >
                    {diff}
                  </span>
                  <span className="text-gray-600 font-medium">
                    {stats[diff].completed}/{stats[diff].total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full bg-gradient-to-r ${
                      diff === "easy"
                        ? "from-emerald-400 to-green-500"
                        : diff === "medium"
                        ? "from-amber-400 to-orange-500"
                        : "from-rose-400 to-red-500"
                    }`}
                    style={{
                      width: `${
                        stats[diff].total > 0
                          ? (stats[diff].completed / stats[diff].total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    {Math.round(
                      (stats[diff].completed / stats[diff].total) * 100
                    )}
                    % Complete
                  </span>
                  <span>
                    {stats[diff].total - stats[diff].completed} remaining
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="glass-effect rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Week Selector */}
            <div className="flex items-center gap-4">
              <Calendar className="text-gray-500" size={20} />
              <select
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                value={activeWeek}
                onChange={(e) => setActiveWeek(Number(e.target.value))}
              >
                {weeks.map((week) => (
                  <option key={week} value={week}>
                    Week {week}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search problems, themes, or techniques..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <Filter className="text-gray-500 mt-2" size={20} />
              <select
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Problems</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="space-y-6">
          {Object.entries(problemsByDay).map(([day, dayProblems]) => (
            <div key={day} className="problem-card">
              <button
                className="w-full px-6 py-6 text-left bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all duration-300 rounded-xl"
                onClick={() => setExpandedDay(expandedDay === day ? null : day)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white font-bold text-lg">
                      {dayProblems[0].day}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{day}</h3>
                      <p className="text-gray-600 text-sm mt-1 flex items-center gap-2">
                        <Clock size={16} />
                        Week {dayProblems[0].week} • {dayProblems[0].theme}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">Progress</div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-gray-800">
                          {dayProblems.filter((p) => p.completed).length}/
                          {dayProblems.length}
                        </span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                            style={{
                              width: `${
                                (dayProblems.filter((p) => p.completed).length /
                                  dayProblems.length) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className={`transform transition-transform duration-300 ${
                        expandedDay === day ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown className="text-gray-400" size={24} />
                    </div>
                  </div>
                </div>
              </button>

              {expandedDay === day && (
                <div className="border-t border-gray-200/50">
                  {dayProblems.map((problem, index) => (
                    <div
                      key={problem.title}
                      className={`p-6 ${
                        index !== dayProblems.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <button
                              onClick={() =>
                                toggleProblemCompletion(problem.title)
                              }
                              className="flex-shrink-0 mt-1 transform hover:scale-110 transition-transform duration-200"
                            >
                              {problem.completed ? (
                                <CheckCircle2
                                  className="text-green-500"
                                  size={28}
                                />
                              ) : (
                                <Circle
                                  className="text-gray-300 hover:text-gray-400"
                                  size={28}
                                />
                              )}
                            </button>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h4 className="font-bold text-gray-800 text-lg mb-1 flex items-center gap-2">
                                    {problem.title}
                                    {problem.leetcode && (
                                      <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                                        #{problem.leetcode}
                                      </span>
                                    )}
                                  </h4>
                                  <div className="flex items-center gap-3 flex-wrap">
                                    <span
                                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(
                                        problem.difficulty
                                      )}`}
                                    >
                                      {problem.difficulty}
                                    </span>
                                    <span className="text-gray-600 text-sm flex items-center gap-1">
                                      <Lightbulb size={14} />
                                      {problem.technique}
                                    </span>
                                    {problem.completed &&
                                      problem.completedDate && (
                                        <span className="text-green-600 text-sm flex items-center gap-1">
                                          <Calendar size={14} />
                                          {new Date(
                                            problem.completedDate
                                          ).toLocaleDateString()}
                                        </span>
                                      )}
                                  </div>
                                </div>
                              </div>

                              {/* Notes Section */}
                              <div className="mt-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Bookmark
                                    size={16}
                                    className="text-gray-400"
                                  />
                                  <span className="text-sm font-medium text-gray-600">
                                    Your Notes
                                  </span>
                                </div>
                                <textarea
                                  placeholder="Add your notes, insights, or approach here..."
                                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white/50 backdrop-blur-sm"
                                  rows={3}
                                  value={notes[problem.title] || ""}
                                  onChange={(e) =>
                                    updateNotes(problem.title, e.target.value)
                                  }
                                />
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-3 mt-4">
                                <a
                                  href={`https://leetcode.com/problems/${problem.title
                                    .toLowerCase()
                                    .replace(/ /g, "-")}/`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-4 py-2 btn-primary"
                                >
                                  <ExternalLink size={16} />
                                  Solve on LeetCode
                                </a>
                                <button
                                  onClick={() =>
                                    toggleProblemCompletion(problem.title)
                                  }
                                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                                    problem.completed
                                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                      : "bg-green-100 text-green-700 hover:bg-green-200"
                                  }`}
                                >
                                  {problem.completed ? (
                                    <>
                                      <Circle size={16} />
                                      Mark as Pending
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 size={16} />
                                      Mark as Completed
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {Object.keys(problemsByDay).length === 0 && (
          <div className="text-center py-16 glass-effect rounded-2xl">
            <Target className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              No problems found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try adjusting your search or filter criteria. Don't worry, there
              are plenty of challenges waiting for you!
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 py-8 text-gray-500">
          <p>Keep solving, keep growing! 🚀</p>
        </div>
      </div>
    </div>
  );
};

// Your complete problemList array goes here

export default ProblemList;
