
SUser opens app → fetch articles from GNews → show articles
                                           ↓ (immediately after, silently)
                              send all article titles to Gemini
                                           ↓
                              Gemini says which are positive/neutral/negative
                                           ↓
                              badges appear on cards
                              
you don't need to save articles in a cache first. The silent second call just sends the titles directly to Gemini. That's it. No ID needed.
The only thing you cache is the result — the sentiment labels — so if the user switches to Finance and comes back to Technology, you don't call Gemini again for the same articles.
So the actual flow is:
Call 1 (GNews)    → returns 10 articles with title, url, description
Call 2 (Gemini)   → you send the 10 titles → Gemini returns ["positive", "negative", "neutral"...]
                  → you zip them together  → article[0].sentiment = "positive" etc
                  → badges appear on cards






tep 1 — Get your Gemini API key
Go to https://aistudio.google.com/app/apikey, sign in with Google, click "Create API key".

