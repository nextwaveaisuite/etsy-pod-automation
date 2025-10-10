import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Comprehensive productivity planner templates
// Perfect for print-on-demand: lightweight, easy to design, high demand
const PLANNER_TEMPLATES = [
  {
    id: 1,
    name: "Daily Planner - Minimalist",
    category: "Daily Planners",
    type: "planner",
    format: "A4 / Letter",
    pages: 1,
    avgPrice: 3.99,
    popularity: 98,
    difficulty: "Easy",
    designTime: "15 min",
    elements: [
      "Date field",
      "Top 3 priorities",
      "Hourly schedule (6am-10pm)",
      "Notes section",
      "Water tracker",
      "Gratitude prompt"
    ],
    colors: ["#000000", "#FFFFFF"],
    style: "minimalist",
    keywords: ["daily planner", "minimalist planner", "productivity", "daily schedule"],
    bestFor: ["students", "professionals", "busy moms"],
    printOptions: ["PDF download", "poster", "notepad"]
  },
  {
    id: 2,
    name: "To-Do List - Priority Matrix",
    category: "To-Do Lists",
    type: "todo",
    format: "A5 / Half Letter",
    pages: 1,
    avgPrice: 2.99,
    popularity: 95,
    difficulty: "Easy",
    designTime: "10 min",
    elements: [
      "Urgent & Important quadrant",
      "Important but not urgent",
      "Urgent but not important",
      "Neither urgent nor important",
      "Date field",
      "Completion checkboxes"
    ],
    colors: ["#4A90E2", "#FFFFFF"],
    style: "modern",
    keywords: ["to do list", "task list", "priority matrix", "eisenhower matrix"],
    bestFor: ["professionals", "entrepreneurs", "project managers"],
    printOptions: ["PDF download", "notepad", "poster"]
  },
  {
    id: 3,
    name: "Habit Tracker - 30 Day",
    category: "Habit Trackers",
    type: "tracker",
    format: "A4 / Letter",
    pages: 1,
    avgPrice: 4.99,
    popularity: 97,
    difficulty: "Easy",
    designTime: "20 min",
    elements: [
      "30-day grid",
      "10 habit rows",
      "Month/year field",
      "Habit name fields",
      "Color-coded checkboxes",
      "Progress summary"
    ],
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
    style: "colorful",
    keywords: ["habit tracker", "30 day challenge", "daily habits", "routine tracker"],
    bestFor: ["self-improvement", "fitness", "wellness"],
    printOptions: ["PDF download", "poster", "notepad"]
  },
  {
    id: 4,
    name: "Weekly Planner - Time Blocking",
    category: "Weekly Planners",
    type: "planner",
    format: "A4 / Letter Landscape",
    pages: 1,
    avgPrice: 4.49,
    popularity: 94,
    difficulty: "Medium",
    designTime: "25 min",
    elements: [
      "7-day columns",
      "Hourly time blocks (6am-10pm)",
      "Week goals section",
      "Priority tasks",
      "Notes area",
      "Week number"
    ],
    colors: ["#9B59B6", "#FFFFFF"],
    style: "professional",
    keywords: ["weekly planner", "time blocking", "weekly schedule", "productivity planner"],
    bestFor: ["professionals", "students", "entrepreneurs"],
    printOptions: ["PDF download", "poster"]
  },
  {
    id: 5,
    name: "Goal Setting Worksheet",
    category: "Goal Planners",
    type: "worksheet",
    format: "A4 / Letter",
    pages: 1,
    avgPrice: 3.49,
    popularity: 92,
    difficulty: "Easy",
    designTime: "15 min",
    elements: [
      "SMART goals framework",
      "Goal statement",
      "Action steps",
      "Timeline",
      "Resources needed",
      "Success metrics",
      "Obstacles & solutions"
    ],
    colors: ["#F39C12", "#FFFFFF"],
    style: "motivational",
    keywords: ["goal setting", "smart goals", "goal planner", "vision board"],
    bestFor: ["self-improvement", "entrepreneurs", "students"],
    printOptions: ["PDF download", "poster"]
  },
  {
    id: 6,
    name: "Budget Tracker - Monthly",
    category: "Budget Planners",
    type: "tracker",
    format: "A4 / Letter",
    pages: 1,
    avgPrice: 4.99,
    popularity: 96,
    difficulty: "Medium",
    designTime: "30 min",
    elements: [
      "Income section",
      "Fixed expenses",
      "Variable expenses",
      "Savings goals",
      "Debt tracking",
      "Monthly summary",
      "Expense categories"
    ],
    colors: ["#27AE60", "#FFFFFF"],
    style: "clean",
    keywords: ["budget tracker", "monthly budget", "expense tracker", "finance planner"],
    bestFor: ["personal finance", "budgeting", "saving money"],
    printOptions: ["PDF download", "notepad"]
  },
  {
    id: 7,
    name: "Meal Planner - Weekly",
    category: "Meal Planners",
    type: "planner",
    format: "A4 / Letter",
    pages: 1,
    avgPrice: 3.99,
    popularity: 93,
    difficulty: "Easy",
    designTime: "20 min",
    elements: [
      "7-day meal grid",
      "Breakfast/Lunch/Dinner/Snacks",
      "Shopping list",
      "Prep notes",
      "Recipe ideas",
      "Nutritional goals"
    ],
    colors: ["#E74C3C", "#FFFFFF"],
    style: "friendly",
    keywords: ["meal planner", "weekly meal plan", "meal prep", "grocery list"],
    bestFor: ["meal prep", "healthy eating", "busy families"],
    printOptions: ["PDF download", "poster", "notepad"]
  },
  {
    id: 8,
    name: "Fitness Tracker - Workout Log",
    category: "Fitness Trackers",
    type: "tracker",
    format: "A5 / Half Letter",
    pages: 1,
    avgPrice: 3.49,
    popularity: 91,
    difficulty: "Easy",
    designTime: "15 min",
    elements: [
      "Date field",
      "Exercise name",
      "Sets/Reps/Weight",
      "Duration",
      "Calories burned",
      "Notes",
      "Progress photos"
    ],
    colors: ["#E67E22", "#FFFFFF"],
    style: "sporty",
    keywords: ["fitness tracker", "workout log", "exercise tracker", "gym log"],
    bestFor: ["fitness", "gym", "health"],
    printOptions: ["PDF download", "notepad"]
  },
  {
    id: 9,
    name: "Gratitude Journal - Daily",
    category: "Gratitude Journals",
    type: "journal",
    format: "A5 / Half Letter",
    pages: 1,
    avgPrice: 2.99,
    popularity: 94,
    difficulty: "Easy",
    designTime: "10 min",
    elements: [
      "Date field",
      "3 things I'm grateful for",
      "Today's highlight",
      "Positive affirmation",
      "Mood tracker",
      "Reflection prompt"
    ],
    colors: ["#F8B500", "#FFFFFF"],
    style: "warm",
    keywords: ["gratitude journal", "daily gratitude", "thankful journal", "mindfulness"],
    bestFor: ["mental health", "mindfulness", "self-care"],
    printOptions: ["PDF download", "notepad"]
  },
  {
    id: 10,
    name: "Project Planner - Action Plan",
    category: "Project Planners",
    type: "planner",
    format: "A4 / Letter",
    pages: 1,
    avgPrice: 4.49,
    popularity: 89,
    difficulty: "Medium",
    designTime: "25 min",
    elements: [
      "Project name",
      "Timeline/milestones",
      "Task breakdown",
      "Resources needed",
      "Team members",
      "Budget",
      "Risk assessment",
      "Success criteria"
    ],
    colors: ["#3498DB", "#FFFFFF"],
    style: "professional",
    keywords: ["project planner", "action plan", "project management", "task planner"],
    bestFor: ["project managers", "entrepreneurs", "teams"],
    printOptions: ["PDF download", "poster"]
  },
  {
    id: 11,
    name: "Water Intake Tracker",
    category: "Health Trackers",
    type: "tracker",
    format: "A5 / Half Letter",
    pages: 1,
    avgPrice: 2.49,
    popularity: 88,
    difficulty: "Easy",
    designTime: "10 min",
    elements: [
      "Date field",
      "8-10 water glass icons",
      "Hourly reminders",
      "Daily goal",
      "Weekly summary",
      "Motivational quote"
    ],
    colors: ["#3498DB", "#FFFFFF"],
    style: "simple",
    keywords: ["water tracker", "hydration tracker", "water intake", "health tracker"],
    bestFor: ["health", "wellness", "fitness"],
    printOptions: ["PDF download", "sticker", "poster"]
  },
  {
    id: 12,
    name: "Sleep Tracker - Quality Log",
    category: "Health Trackers",
    type: "tracker",
    format: "A4 / Letter",
    pages: 1,
    avgPrice: 3.99,
    popularity: 87,
    difficulty: "Easy",
    designTime: "15 min",
    elements: [
      "Date field",
      "Bedtime/wake time",
      "Hours slept",
      "Sleep quality rating",
      "Dreams notes",
      "Factors affecting sleep",
      "Morning mood"
    ],
    colors: ["#9B59B6", "#FFFFFF"],
    style: "calming",
    keywords: ["sleep tracker", "sleep log", "sleep quality", "rest tracker"],
    bestFor: ["health", "wellness", "sleep improvement"],
    printOptions: ["PDF download", "notepad"]
  },
  {
    id: 13,
    name: "Reading List Tracker",
    category: "Hobby Trackers",
    type: "tracker",
    format: "A4 / Letter",
    pages: 1,
    avgPrice: 3.49,
    popularity: 90,
    difficulty: "Easy",
    designTime: "15 min",
    elements: [
      "Book title",
      "Author",
      "Genre",
      "Start/finish date",
      "Rating (5 stars)",
      "Notes/review",
      "Favorite quotes",
      "Reading goal progress"
    ],
    colors: ["#8E44AD", "#FFFFFF"],
    style: "literary",
    keywords: ["reading tracker", "book list", "reading log", "book tracker"],
    bestFor: ["book lovers", "students", "book clubs"],
    printOptions: ["PDF download", "poster"]
  },
  {
    id: 14,
    name: "Cleaning Schedule - Weekly",
    category: "Home Management",
    type: "schedule",
    format: "A4 / Letter",
    pages: 1,
    avgPrice: 2.99,
    popularity: 92,
    difficulty: "Easy",
    designTime: "15 min",
    elements: [
      "7-day grid",
      "Room-by-room tasks",
      "Daily tasks",
      "Weekly tasks",
      "Monthly tasks",
      "Checkboxes",
      "Notes section"
    ],
    colors: ["#1ABC9C", "#FFFFFF"],
    style: "organized",
    keywords: ["cleaning schedule", "chore chart", "cleaning checklist", "home organization"],
    bestFor: ["homemakers", "busy families", "organization"],
    printOptions: ["PDF download", "poster"]
  },
  {
    id: 15,
    name: "Mood Tracker - Monthly",
    category: "Mental Health",
    type: "tracker",
    format: "A4 / Letter",
    pages: 1,
    avgPrice: 3.99,
    popularity: 95,
    difficulty: "Easy",
    designTime: "20 min",
    elements: [
      "30-day calendar grid",
      "Color-coded mood scale",
      "Mood legend",
      "Triggers/patterns notes",
      "Monthly reflection",
      "Coping strategies"
    ],
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#F7DC6F"],
    style: "therapeutic",
    keywords: ["mood tracker", "mental health", "emotion tracker", "wellness journal"],
    bestFor: ["mental health", "self-care", "therapy"],
    printOptions: ["PDF download", "poster"]
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const type = searchParams.get("type");
  const minPopularity = parseInt(searchParams.get("minPopularity") || "0");
  const difficulty = searchParams.get("difficulty");
  const limit = parseInt(searchParams.get("limit") || "50");
  
  let templates = PLANNER_TEMPLATES;
  
  // Filter by category
  if (category) {
    templates = templates.filter(t => 
      t.category.toLowerCase().includes(category.toLowerCase())
    );
  }
  
  // Filter by type
  if (type) {
    templates = templates.filter(t => t.type === type);
  }
  
  // Filter by popularity
  if (minPopularity > 0) {
    templates = templates.filter(t => t.popularity >= minPopularity);
  }
  
  // Filter by difficulty
  if (difficulty) {
    templates = templates.filter(t => 
      t.difficulty.toLowerCase() === difficulty.toLowerCase()
    );
  }
  
  // Sort by popularity descending
  templates = templates.sort((a, b) => b.popularity - a.popularity);
  
  // Limit results
  templates = templates.slice(0, limit);
  
  return NextResponse.json({
    templates,
    total: templates.length,
    categories: [...new Set(PLANNER_TEMPLATES.map(t => t.category))],
    types: [...new Set(PLANNER_TEMPLATES.map(t => t.type))],
    note: "Ready-to-design productivity templates for POD"
  });
}

export async function POST(req: NextRequest) {
  const { templateId, customization } = await req.json();
  
  if (!templateId) {
    return NextResponse.json({ 
      error: "Provide 'templateId' to get template details" 
    }, { status: 400 });
  }
  
  const template = PLANNER_TEMPLATES.find(t => t.id === templateId);
  
  if (!template) {
    return NextResponse.json({
      error: "Template not found",
      availableIds: PLANNER_TEMPLATES.map(t => t.id)
    }, { status: 404 });
  }
  
  // Return template with design specifications
  return NextResponse.json({
    template,
    designSpecs: {
      format: template.format,
      orientation: template.format.includes("Landscape") ? "landscape" : "portrait",
      dimensions: {
        A4: { width: 210, height: 297, unit: "mm" },
        Letter: { width: 8.5, height: 11, unit: "inches" },
        A5: { width: 148, height: 210, unit: "mm" },
        "Half Letter": { width: 5.5, height: 8.5, unit: "inches" }
      },
      margins: { top: 15, right: 15, bottom: 15, left: 15, unit: "mm" },
      fonts: {
        heading: "Montserrat Bold",
        body: "Open Sans Regular",
        accent: "Playfair Display"
      },
      exportFormats: ["PDF", "PNG", "JPG"],
      printReady: true,
      bleed: 3 // mm
    },
    marketingCopy: {
      title: `${template.name} - Printable ${template.category}`,
      description: `Stay organized with this ${template.name}! Perfect for ${template.bestFor.join(', ')}. Includes ${template.elements.join(', ')}. Instant download, print at home or at your local print shop.`,
      tags: template.keywords,
      bulletPoints: template.elements.map(e => `✓ ${e}`)
    },
    customization: customization || {
      colors: template.colors,
      addLogo: false,
      addCustomText: false
    }
  });
}

