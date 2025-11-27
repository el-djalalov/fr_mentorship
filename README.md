# Frontend Development Mentorship

## 🎯 Project Overview

This repository contains **complete, working reference implementations** for your 6-session frontend mentorship program. Each project builds progressively, showing the same TaskMaster application implemented with different technologies.

## 📁 Repository Structure

```
fr_mentorship/
├── plan.md                          # Your original mentorship curriculum (git ignored)
├── session-1-2-html-css/           # Static HTML/CSS version
│   ├── index.html                  # Full semantic HTML with layout
│   └── styles.css                  # Comprehensive CSS with comments
├── session-2-vanilla-js/           # Interactive JavaScript version
│   ├── index.html                  # Dynamic HTML structure
│   ├── styles.css                  # Extended styles for modals/states
│   └── app.js                      # Full CRUD with localStorage
└── session-3-6-react-app/          # Complete React application
    ├── src/
    │   ├── components/             # Reusable UI components
    │   ├── context/                # Global state management
    │   ├── hooks/                  # Custom React hooks
    │   ├── pages/                  # Route pages
    │   └── App.jsx                 # Main app with routing
    └── package.json
```

## 🗓️ Session-by-Session Guide

### Session 1: HTML, CSS & Layout Fundamentals (2.5 hours)

**Reference:** `session-1-2-html-css/`

#### What to Teach:
1. **Browser Rendering Pipeline** (15 min)
   - Show DevTools Network tab
   - Explain HTML parsing → DOM construction → CSSOM → Render tree
   - Demo: Change CSS and watch repaint in Performance tab

2. **Flexbox Deep Dive** (30 min)
   - Show navbar in code: `justify-content`, `align-items`, `gap`
   - Live code: Build a card layout from scratch
   - Common patterns: centering, space-between, wrap

3. **CSS Grid Deep Dive** (30 min)
   - Show dashboard layout: `grid-template-columns`, `grid-template-areas`
   - Live code: Create a photo gallery grid
   - Responsive grids: `repeat(auto-fit, minmax())`

4. **Mob Coding Exercise** (20 min)
   - Together: Build a responsive pricing cards section
   - Practice: Flexbox cards that become grid on desktop

#### Key Teaching Points:
- **CSS Custom Properties:** Explain they're like constants - reusability!
- **Box Model:** Show DevTools visual box model
- **Specificity:** ID > Class > Element (demo with examples)
- **Mobile-First:** Start with mobile styles, enhance with media queries

#### Common Student Questions:
- *"When should I use Flexbox vs Grid?"* → Flexbox for 1D (rows/columns), Grid for 2D layouts
- *"Why use semantic HTML?"* → Accessibility, SEO, maintainability
- *"What's the difference between margin and padding?"* → Show box model diagram

#### Files to Reference:
- [index.html](session-1-2-html-css/index.html) - Lines 10-45: Semantic structure
- [styles.css](session-1-2-html-css/styles.css) - Lines 97-150: Flexbox & Grid patterns

---

### Session 2: JavaScript in the Browser (2.5 hours)

**Reference:** `session-2-vanilla-js/`

#### What to Teach:
1. **DOM Manipulation** (30 min)
   - `document.querySelector()` vs `getElementById()`
   - Creating elements: `createElement()`, `appendChild()`
   - Template literals for dynamic HTML
   - DocumentFragment for performance

2. **Event Handling** (30 min)
   - Click, input, submit events
   - `event.preventDefault()`, `event.target`
   - Event delegation (ONE listener on parent, not many on children)
   - Data attributes for metadata (`data-task-id`)

3. **Fetch API & Async/Await** (30 min)
   - HTTP GET requests
   - JSON parsing
   - Error handling with try/catch
   - Loading states

4. **Mob Coding** (25 min)
   - Build: User list that filters as you type
   - Use: fetch, filter, render pattern

#### Key Teaching Points:
- **Event Delegation:** Explain why it's more efficient than individual listeners
- **Array Methods:** `filter`, `map`, `reduce` - functional programming concepts
- **Promises vs Async/Await:** Show both syntaxes, recommend async/await for readability
- **LocalStorage:** Simple key-value store, JSON.stringify/parse

#### Code Walkthrough:
Walk through `app.js` in this order:
1. Lines 18-60: State management (like a mini-database)
2. Lines 88-140: CRUD operations (compare to backend services)
3. Lines 215-280: DOM rendering (like React's render)
4. Lines 430-490: Event delegation pattern

#### Common Pitfalls:
- Forgetting `e.preventDefault()` on form submit → page reloads
- Mutating arrays directly instead of creating new ones
- Not handling errors in fetch → silent failures
- Adding event listeners in loops → memory leaks

#### Backend Dev Bridge:
> "Think of the DOM as an in-memory database that renders visually. When you modify it, the browser 'commits' the changes (repaint). Events are like webhooks - something happens, you respond."

---

### Session 3: Modern Tooling & React Introduction (3 hours)

**Reference:** `session-3-6-react-app/`

#### What to Teach:
1. **Why Build Tools?** (20 min)
   - ES6 modules: `import`/`export`
   - JSX needs compilation (it's not HTML!)
   - Hot Module Replacement (HMR) for fast development
   - Code splitting & optimization

2. **Vite Setup** (15 min)
   ```bash
   npm create vite@latest my-app -- --template react
   cd my-app
   npm install
   npm run dev
   ```
   - Show project structure
   - Explain `index.html`, `main.jsx`, `App.jsx`

3. **React Fundamentals** (30 min)
   - Components are functions that return JSX
   - Props: passing data down
   - JSX rules: className, self-closing tags, {} for expressions
   - Map over arrays with `key` prop

4. **Component Composition** (30 min)
   - Container vs Presentational components
   - Children prop pattern
   - Reusable UI components: Button, Card, Input

5. **Mob Coding** (40 min)
   - Build component library together
   - Create: Button, Card, Badge, Input with variants
   - Use them to compose a TaskCard

#### Key Teaching Points:
- **Components = Functions:** No magic, just functions returning JSX
- **Props = Function Parameters:** Read-only, flow downward
- **JSX ≠ HTML:** It compiles to `React.createElement()` calls
- **Keys:** Needed for lists so React knows what changed

#### Code Structure to Show:
```jsx
// Basic Component (SESSION 3)
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Composition (SESSION 3)
function Card({ children, variant }) {
  return (
    <div className={`card card--${variant}`}>
      {children}
    </div>
  );
}

// Using it
<Card variant="elevated">
  <Greeting name="Alex" />
  <Button>Click me</Button>
</Card>
```

#### Common Student Mistakes:
- Using `class` instead of `className`
- Forgetting to capitalize component names
- Not adding `key` to mapped elements
- Trying to modify props (they're immutable!)

---

### Session 4: React State & Data Flow (2.5 hours)

**Reference:** `session-3-6-react-app/src/context/TaskContext.jsx`

#### What to Teach:
1. **useState Hook** (30 min)
   - Syntax: `const [value, setValue] = useState(initial)`
   - State triggers re-renders
   - Never mutate state directly
   - Functional updates: `setCount(prev => prev + 1)`

2. **Controlled Forms** (30 min)
   - Input value tied to state
   - onChange updates state
   - Form submission with `e.preventDefault()`
   - Multi-field forms with object state

3. **Lifting State Up** (30 min)
   - Parent owns state, children receive via props
   - Callbacks to modify parent state
   - When to lift vs keep local

4. **useReducer** (20 min)
   - For complex state logic
   - Actions describe WHAT happened
   - Reducer describes HOW state changes
   - Pattern: `dispatch({ type: 'ADD_TASK', payload: task })`

#### Example Code Flow:
```jsx
// useState (SESSION 4)
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// Controlled Form (SESSION 4)
function TaskForm({ onSubmit }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title });
    setTitle(''); // Clear form
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
}

// useReducer (SESSION 4)
const taskReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'DELETE':
      return state.filter(t => t.id !== action.payload);
    default:
      return state;
  }
};

function TaskApp() {
  const [tasks, dispatch] = useReducer(taskReducer, []);

  return (
    <div>
      <TaskForm onSubmit={task => dispatch({ type: 'ADD', payload: task })} />
      <TaskList
        tasks={tasks}
        onDelete={id => dispatch({ type: 'DELETE', payload: id })}
      />
    </div>
  );
}
```

#### Backend Dev Bridge:
> "useState is like a class field that persists across function calls. useReducer is like Redux or event sourcing - actions in, new state out. React compares references to detect changes, which is why we never mutate - always create new objects/arrays."

#### Common Pitfalls:
- Mutating state: `tasks.push(newTask)` ❌ Use `[...tasks, newTask]` ✅
- Forgetting functional updates: `setCount(count + 1)` in callbacks can be stale
- Not preventing form default → page refreshes
- Passing the result of `setState()` instead of the function

---

### Session 5: Effects, Data Fetching & Routing (3 hours)

**Reference:** `session-3-6-react-app/src/hooks/`, `src/pages/`

#### What to Teach:
1. **useEffect** (35 min)
   - Runs AFTER render
   - Dependency array controls when it runs
   - Cleanup function (return value)
   - Common uses: data fetching, subscriptions, timers

2. **Data Fetching in React** (35 min)
   - Fetch in useEffect
   - Loading, error, success states
   - AbortController for cleanup
   - Handling race conditions

3. **Custom Hooks** (30 min)
   - Extract reusable logic
   - Must start with "use"
   - Can use other hooks inside
   - Example: `useFetch`, `useLocalStorage`

4. **React Router** (40 min)
   - Setup: BrowserRouter, Routes, Route
   - Link vs `<a>` tags
   - useParams for URL params
   - useNavigate for programmatic navigation
   - Navigate component for redirects

5. **Mob Coding** (20 min)
   - Add routing to capstone
   - Create detail page with URL param

#### Code Examples:
```jsx
// useEffect (SESSION 5)
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]); // Re-run when userId changes

  if (loading) return <Spinner />;
  return <div>{user.name}</div>;
}

// Custom Hook (SESSION 5)
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));

    return () => controller.abort(); // Cleanup
  }, [url]);

  return { data, loading, error };
}

// Usage
function Users() {
  const { data: users, loading, error } = useFetch('/api/users');

  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  return <UserList users={users} />;
}

// React Router (SESSION 5)
function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/tasks">Tasks</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/tasks/:id" element={<TaskDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

// Using URL params
function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: task, loading } = useFetch(`/api/tasks/${id}`);

  if (loading) return <Spinner />;
  if (!task) return <NotFound />;

  return (
    <div>
      <h1>{task.title}</h1>
      <button onClick={() => navigate('/tasks')}>Back</button>
    </div>
  );
}
```

#### useEffect Dependency Rules:
- `[]` - Run once on mount
- `[dep]` - Run when dep changes
- No array - Run after every render (usually wrong!)

#### Common Mistakes:
- Missing dependencies in useEffect → stale closures
- Not cleaning up (subscriptions, timers, event listeners)
- Fetching in the component body instead of useEffect
- Using `<a>` instead of `<Link>` → full page reload

---

### Session 6: Styling, Polish & Deployment (3 hours)

**Reference:** Ready for Tailwind in `session-3-6-react-app/`

#### What to Teach:
1. **Tailwind CSS** (35 min)
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
   - Utility-first approach
   - Responsive prefixes: `sm:`, `md:`, `lg:`
   - Hover states: `hover:bg-blue-700`
   - Dark mode: `dark:bg-gray-800`

2. **Component Styling Patterns** (35 min)
   - Variant props with Tailwind
   - Conditional classes with template literals
   - Common patterns: buttons, cards, forms

3. **Loading & Error States** (30 min)
   - Skeleton screens
   - Spinner components
   - Empty states with CTAs
   - Error boundaries (class components)

4. **Animations** (20 min)
   - CSS transitions for hover effects
   - Framer Motion for complex animations (optional)
   - Tailwind animate utilities

5. **Deployment** (30 min)
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```
   - Build for production
   - Environment variables
   - CDN benefits

#### Tailwind Patterns:
```jsx
// Button with variants
function Button({ children, variant = 'primary', size = 'md', ...props }) {
  const baseClasses = 'rounded font-medium transition-colors';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Loading state
function TaskList({ tasks, loading, error }) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>Something went wrong: {error}</p>
        <button className="mt-4 text-blue-600 hover:underline">Try again</button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg mb-4">No tasks yet</p>
        <Button>Create your first task</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map(task => <TaskCard key={task.id} task={task} />)}
    </div>
  );
}
```

---

## 💡 Teaching Tips

### For Backend Developers

Use these analogies:

| Frontend Concept | Backend Analogy |
|-----------------|----------------|
| Components | Microservices - single responsibility |
| Props | Function parameters - immutable input |
| State | Database - mutable data store |
| useEffect | Lifecycle hooks (@PostConstruct) |
| Context API | Dependency injection |
| React Router | Controller routing (Express, Spring) |
| Custom hooks | Service layer - reusable logic |
| Fetch/Axios | HTTP client (RestTemplate, Axios) |

### Common Backend Dev Mindset Shifts

1. **Declarative vs Imperative**
   - Backend: "How to do it" (imperative)
   - Frontend: "What it should look like" (declarative)

2. **Data Flow**
   - Backend: Stateless requests, database is source of truth
   - Frontend: Stateful components, props flow down

3. **Thinking in Components**
   - Backend: Think in services and layers
   - Frontend: Think in UI components and composition

### Debugging Tips to Teach

1. **React DevTools** - Inspect component tree, props, state
2. **Console.log** - Still works! Log render cycles to understand flow
3. **Debugger** - Set breakpoints in useEffect, event handlers
4. **Network Tab** - See API calls, response times

---

## 📚 Additional Resources for Students

### Practice Challenges
After each session, students can:

**Session 1:** Recreate layouts from dribbble.com
**Session 2:** Build a Pokemon search using PokeAPI
**Session 3:** Component-ize their portfolio from Session 1
**Session 4:** Add a todo app with filters
**Session 5:** Integrate GitHub API for profile viewer
**Session 6:** Polish and deploy their capstone

### Recommended Reading
- [MDN Web Docs](https://developer.mozilla.org/) - Reference
- [React.dev](https://react.dev/) - Official React docs
- [JavaScript.info](https://javascript.info/) - Deep JavaScript
- [CSS Tricks](https://css-tricks.com/) - Layout guides

### Video Resources
- Fireship (quick concept overviews)
- Web Dev Simplified (in-depth tutorials)
- Theo - t3.gg (modern practices)

---

## 🎓 Session Execution Tips

### Before Each Session
1. Open reference code in your editor
2. Have browser DevTools ready
3. Prepare 2-3 "stumper" debugging scenarios
4. Have the previous week's assignment solution ready

### During Sessions
1. **Code live** - Don't copy-paste completed code
2. **Make mistakes** - Then fix them together
3. **Ask questions** - "What do you think will happen?"
4. **Use analogies** - Especially for backend devs

### After Sessions
1. Push your live-coded examples to repo
2. Share solution to assignment in a separate branch
3. Encourage students to share their solutions
4. Review pull requests async if possible

---

## 🚀 Running the Projects

### HTML/CSS Version (Session 1-2)
```bash
cd session-1-2-html-css
# Open index.html in browser (or use Live Server in VS Code)
```

### Vanilla JS Version (Session 2)
```bash
cd session-2-vanilla-js
# Open index.html in browser
# Works completely offline - no build needed!
```

### React Version (Sessions 3-6)
```bash
cd session-3-6-react-app
npm install
npm run dev
# Open http://localhost:5173
```

---

## 🐛 Common Issues & Solutions

### Students Can't See Changes
- Check if file is saved
- Hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)
- Clear cache
- Check if correct file is linked

### React App Won't Start
- Delete `node_modules` and `package-lock.json`, run `npm install`
- Check Node version: `node -v` (should be 18+)
- Port 5173 already in use? Kill process or use `--port 3000`

### CSS Not Working
- Check selector specificity
- Look for typos in class names
- Verify file is linked: `<link rel="stylesheet" href="styles.css">`
- Check browser DevTools "Elements" tab to see computed styles

---

## 📊 Progress Tracking

Track student progress with this rubric:

### Session Completion Checklist

**Session 1:**
- [ ] Built responsive layout with Flexbox
- [ ] Created 2D layout with Grid
- [ ] Understands media queries
- [ ] Completed portfolio assignment

**Session 2:**
- [ ] Manipulated DOM programmatically
- [ ] Used event delegation
- [ ] Fetched data from API
- [ ] Completed interactive directory assignment

**Session 3:**
- [ ] Set up Vite + React project
- [ ] Created 5+ reusable components
- [ ] Used props effectively
- [ ] Started capstone project

**Session 4:**
- [ ] Implemented CRUD with useState/useReducer
- [ ] Created controlled forms
- [ ] Lifted state appropriately
- [ ] Added full interactivity to capstone

**Session 5:**
- [ ] Used useEffect for data fetching
- [ ] Created custom hooks
- [ ] Implemented routing with React Router
- [ ] Integrated real API into capstone

**Session 6:**
- [ ] Applied Tailwind CSS consistently
- [ ] Implemented loading/error states
- [ ] Deployed to production
- [ ] Completed capstone project

---

## 🎉 Success Metrics

Students are ready when they can:

1. **Start a project from scratch** without guidance
2. **Debug common errors** independently
3. **Read documentation** and apply new concepts
4. **Think in components** when designing UI
5. **Confidently explain** what their code does

---

## 📧 Questions?

This is your reference implementation. Feel free to:
- Modify examples to fit your teaching style
- Add more examples for specific student needs
- Simplify if moving too fast
- Add complexity for advanced students

**Remember:** The goal is confidence, not perfection. Students should feel empowered to build, not intimidated by complexity.

Good luck with your mentorship program! 🚀
