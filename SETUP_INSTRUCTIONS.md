# 🚀 Setup Instructions - Quick Start

## 📦 Step 1: Install Dependencies

```bash
cd frontend
npm install canvas-confetti react-hot-toast
npm install --save-dev @types/canvas-confetti
```

## 🔧 Step 2: Update Layout (Add Toast Provider)

**File:** `frontend/src/app/layout.tsx`

Add this import at the top:
```typescript
import { Toaster } from 'react-hot-toast';
```

Add `<Toaster />` before the closing `</body>` tag:
```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* existing content */}
        {children}
        
        {/* Add this line */}
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
```

## 🎮 Step 3: Update Play Page (Add Start Button)

**File:** `frontend/src/app/play/page.tsx`

Find the section where games are displayed and add a prominent "Start Game" button.

Add this near the top of the component:
```typescript
import { useRouter } from 'next/navigation';

export default function PlayPage() {
  const router = useRouter();
  
  // ... existing code ...
  
  return (
    <div>
      {/* Add this featured game section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🎓 Celo Basics Quiz
          </h2>
          <p className="text-gray-600 mb-6">
            Test your knowledge about Celo blockchain and earn cUSD rewards!
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Prize Pool</p>
              <p className="text-2xl font-bold text-green-600">2.5 cUSD</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Entry Fee</p>
              <p className="text-2xl font-bold text-blue-600">0.1 cUSD</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Questions</p>
              <p className="text-2xl font-bold text-purple-600">5</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Time</p>
              <p className="text-2xl font-bold text-orange-600">2 min</p>
            </div>
          </div>
          
          <button
            onClick={() => router.push('/play/game?gameId=1')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            🎮 Start Playing Now
          </button>
        </div>
      </div>
      
      {/* ... rest of existing content ... */}
    </div>
  );
}
```

## 🧪 Step 4: Test the Flow

```bash
# Start the development server
cd frontend
npm run dev
```

Then test:
1. Navigate to `http://localhost:3000/play`
2. Click "Start Playing Now"
3. Answer the 5 questions
4. View your results
5. Click "Play Again"

## ✅ Verification Checklist

After completing the setup:

- [ ] Dependencies installed successfully
- [ ] Toast notifications appear
- [ ] Can navigate to game page
- [ ] Timer counts down
- [ ] Can select answers
- [ ] Questions advance automatically
- [ ] Results page displays correctly
- [ ] Confetti appears for winners
- [ ] Can play again
- [ ] No console errors

## 🐛 Troubleshooting

### Issue: "Module not found: canvas-confetti"
**Solution:**
```bash
cd frontend
npm install canvas-confetti
npm install --save-dev @types/canvas-confetti
```

### Issue: "Toaster is not defined"
**Solution:** Make sure you imported it:
```typescript
import { Toaster } from 'react-hot-toast';
```

### Issue: "Cannot read property 'push' of undefined"
**Solution:** Make sure you're using `useRouter` from `next/navigation`:
```typescript
import { useRouter } from 'next/navigation';
```

### Issue: Timer not working
**Solution:** Check that Framer Motion is installed:
```bash
npm install framer-motion
```

## 📱 Mobile Testing

To test on mobile:

1. Find your local IP address:
```bash
# On Linux/Mac
ifconfig | grep "inet "

# On Windows
ipconfig
```

2. Access from mobile device:
```
http://YOUR_IP_ADDRESS:3000/play
```

3. Or use ngrok for MiniPay testing:
```bash
npx ngrok http 3000
```

## 🎯 Next Steps

After completing this setup:

1. ✅ Test the complete flow
2. ⏳ Integrate smart contracts
3. ⏳ Add mobile navigation
4. ⏳ Add auto-faucet
5. ⏳ Polish UI/UX
6. ⏳ Record demo video

## 📚 Additional Resources

- [React Hot Toast Docs](https://react-hot-toast.com/)
- [Canvas Confetti Docs](https://www.npmjs.com/package/canvas-confetti)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Next.js Routing Docs](https://nextjs.org/docs/app/building-your-application/routing)

---

**Ready to test!** 🚀

Run the commands above and you'll have a fully functional trivia game!
