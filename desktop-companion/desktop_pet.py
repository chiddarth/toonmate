"""
ToonMate - Desktop Window Walking Companion (Desktop Shimeji Pet)
================================================================
A transparent, frameless, always-on-top desktop companion that walks across
your real Windows screen, on top of any open application, and pesters/disturbs
you until you navigate to your ToonMate schedule!
"""

import sys
import os
import time
import math
import random
import webbrowser
import threading
import json
import tkinter as tk
from tkinter import Canvas

APP_URL = "http://localhost:5173"
TRANSPARENT_COLOR = "#00ffab"  # Chroma key for Windows transparent window

class DesktopPet:
    def __init__(self, character_name="Shinchan", character_type="shinchan"):
        self.character_name = character_name
        self.character_type = character_type
        
        self.root = tk.Tk()
        self.root.title("ToonMate Desktop Pet")
        
        # Configure Window to be frameless, transparent, and ALWAYS ON TOP
        self.root.overrideredirect(True)
        self.root.wm_attributes("-topmost", True)
        self.root.wm_attributes("-transparentcolor", TRANSPARENT_COLOR)
        self.root.config(bg=TRANSPARENT_COLOR)
        
        # Screen dimensions
        self.screen_width = self.root.winfo_screenwidth()
        self.screen_height = self.root.winfo_screenheight()
        
        # Pet window dimensions
        self.width = 240
        self.height = 200
        
        # Position: start at bottom right (just above Windows taskbar)
        self.x = self.screen_width - 320
        self.y = self.screen_height - 260
        self.dx = 3  # walking speed
        self.facing = 1  # 1 for right, -1 for left
        
        # Walking and animation states
        self.step_counter = 0
        self.state = "walking"  # "walking", "nagging", "dancing", "idle"
        self.bubble_text = "I'm watching you! Don't forget your tasks! 👀"
        self.is_nagging = False
        self.nag_level = 0
        
        # Dragging support
        self.drag_start_x = 0
        self.drag_start_y = 0
        
        self.setup_ui()
        self.update_position()
        
        # Start walking loop & pestering loop
        self.root.after(50, self.animate_loop)
        self.root.after(5000, self.pester_loop)
        
    def setup_ui(self):
        self.canvas = Canvas(
            self.root,
            width=self.width,
            height=self.height,
            bg=TRANSPARENT_COLOR,
            highlightthickness=0
        )
        self.canvas.pack(fill=tk.BOTH, expand=True)
        
        # Mouse interactions: click to open app, drag to reposition
        self.canvas.bind("<Button-1>", self.on_click)
        self.canvas.bind("<B1-Motion>", self.on_drag)
        self.canvas.bind("<ButtonRelease-1>", self.on_release)
        # Right click to close
        self.canvas.bind("<Button-3>", self.show_context_menu)
        
    def update_position(self):
        self.root.geometry(f"{self.width}x{self.height}+{int(self.x)}+{int(self.y)}")

    def on_click(self, event):
        self.drag_start_x = event.x
        self.drag_start_y = event.y
        self.is_dragging = False

    def on_drag(self, event):
        self.is_dragging = True
        delta_x = event.x - self.drag_start_x
        delta_y = event.y - self.drag_start_y
        self.x += delta_x
        self.y += delta_y
        self.update_position()

    def on_release(self, event):
        if not getattr(self, "is_dragging", False):
            # Clicked without dragging: Navigate to Web Page!
            self.navigate_to_app()

    def navigate_to_app(self):
        """Focus or open the ToonMate webpage and calm the pet"""
        self.state = "dancing"
        self.bubble_text = "Yay! Navigating to ToonMate! 🚀🎉"
        self.is_nagging = False
        self.draw()
        threading.Thread(target=lambda: webbrowser.open(APP_URL), daemon=True).start()

    def show_context_menu(self, event):
        menu = tk.Menu(self.root, tearoff=0)
        menu.add_command(label="🚀 Open ToonMate Schedule", command=self.navigate_to_app)
        menu.add_command(label="👦 Switch to Shinchan", command=lambda: self.switch_char("Shinchan", "shinchan"))
        menu.add_command(label="🐱 Switch to Doraemon", command=lambda: self.switch_char("Doraemon", "doraemon"))
        menu.add_command(label="⚡ Switch to Pikachu", command=lambda: self.switch_char("Pikachu", "pikachu"))
        menu.add_command(label="🍖 Switch to Luffy", command=lambda: self.switch_char("Luffy", "luffy"))
        menu.add_command(label="🥷 Switch to Hattori", command=lambda: self.switch_char("Hattori", "hattori"))
        menu.add_separator()
        menu.add_command(label="❌ Close Desktop Pet", command=self.root.destroy)
        menu.tk_popup(event.x_root, event.y_root)

    def switch_char(self, name, c_type):
        self.character_name = name
        self.character_type = c_type
        self.bubble_text = f"I'm {name} now! Let's get to work! ✨"
        self.draw()

    def pester_loop(self):
        """Randomly or on schedule, disturb the user by walking to center screen and shouting!"""
        if not self.is_nagging:
            # 50% chance to start pestering
            if random.random() < 0.6:
                self.is_nagging = True
                self.state = "nagging"
                nag_messages = [
                    f"🚨 {self.character_name} says: Don't slack off! Check your schedule! ⏰",
                    "Hey! I'm going to dance right here until you open ToonMate! 💃",
                    "Did you finish your activities?! Click me to check! 📝",
                    f"⚠️ {self.character_name} ALERT: Deadlines are approaching! Click me!",
                    "You cannot ignore me! I live on your screen now! 😜"
                ]
                self.bubble_text = random.choice(nag_messages)
                # Move slightly upward to disturb the user in whatever app they're working in!
                self.y = max(100, min(self.screen_height - 350, self.y - 120))
        else:
            # Continue pestering
            if random.random() < 0.3:
                self.is_nagging = False
                self.state = "walking"
                self.y = self.screen_height - 260
                self.bubble_text = "I'm patrolling your screen... 👀"

        self.root.after(8000, self.pester_loop)

    def animate_loop(self):
        self.step_counter += 1
        
        if self.state == "walking":
            # Walk horizontally across screen
            self.x += self.dx * self.facing
            # Reverse direction at screen borders
            if self.x > self.screen_width - 260:
                self.facing = -1
            elif self.x < 20:
                self.facing = 1
                
            # Random pause / wander
            if random.random() < 0.015:
                self.facing *= -1
                
        elif self.state == "nagging":
            # Shake and bounce up and down to disturb the user!
            self.y += math.sin(self.step_counter * 0.5) * 4
            self.x += math.cos(self.step_counter * 0.3) * 3
            
        elif self.state == "dancing":
            self.y += math.sin(self.step_counter * 0.8) * 6
            if self.step_counter % 60 == 0:
                self.state = "walking"
                self.y = self.screen_height - 260
                self.bubble_text = "Good job checking your schedule! 🌟"

        self.update_position()
        self.draw()
        self.root.after(45, self.animate_loop)

    def draw(self):
        self.canvas.delete("all")
        cx = 100
        cy = 130
        bob = math.sin(self.step_counter * 0.3) * (4 if self.state == "walking" else 2)

        # Draw Speech Bubble
        bubble_y = 20
        self.canvas.create_rectangle(15, bubble_y, 225, bubble_y + 44, fill="#ffffff", outline="#f59e0b", width=2)
        # Bubble pointer
        self.canvas.create_polygon(cx - 5, bubble_y + 44, cx + 5, bubble_y + 44, cx, bubble_y + 54, fill="#ffffff", outline="#f59e0b", width=1)
        # Bubble text
        text_disp = self.bubble_text
        if len(text_disp) > 34:
            text_disp = text_disp[:32] + "..."
        self.canvas.create_text(120, bubble_y + 16, text=text_disp, font=("Segoe UI", 8, "bold"), fill="#1e293b", width=200)
        self.canvas.create_text(120, bubble_y + 32, text="👉 CLICK ME TO OPEN TOONMATE 👈", font=("Segoe UI", 7, "bold"), fill="#dc2626")

        # Draw Character based on character_type
        if self.character_type == "doraemon":
            self.draw_doraemon(cx, cy + bob)
        elif self.character_type == "pikachu":
            self.draw_pikachu(cx, cy + bob)
        elif self.character_type == "luffy":
            self.draw_luffy(cx, cy + bob)
        elif self.character_type == "hattori":
            self.draw_hattori(cx, cy + bob)
        else:
            self.draw_shinchan(cx, cy + bob)

    def draw_shinchan(self, cx, cy):
        # Shinchan body
        # Yellow shorts
        self.canvas.create_rectangle(cx - 20, cy + 18, cx + 20, cy + 34, fill="#facc15", outline="#ca8a04", width=2)
        # Red shirt
        self.canvas.create_rectangle(cx - 24, cy - 8, cx + 24, cy + 20, fill="#ef4444", outline="#b91c1c", width=2)
        # Legs & Shoes
        self.canvas.create_rectangle(cx - 16, cy + 34, cx - 6, cy + 46, fill="#fed7aa", outline="")
        self.canvas.create_rectangle(cx + 6, cy + 34, cx + 16, cy + 46, fill="#fed7aa", outline="")
        self.canvas.create_oval(cx - 20, cy + 42, cx - 4, cy + 50, fill="#facc15", outline="#ca8a04", width=1)
        self.canvas.create_oval(cx + 4, cy + 42, cx + 20, cy + 50, fill="#facc15", outline="#ca8a04", width=1)
        # Head (potato shape)
        self.canvas.create_oval(cx - 30, cy - 42, cx + 30, cy - 2, fill="#fed7aa", outline="#ea580c", width=2)
        # Left cheek bump
        self.canvas.create_oval(cx - 38, cy - 28, cx - 22, cy - 8, fill="#fed7aa", outline="#ea580c", width=2)
        self.canvas.create_oval(cx - 32, cy - 25, cx - 18, cy - 10, fill="#fed7aa", outline="")
        # Black hair
        self.canvas.create_arc(cx - 28, cy - 46, cx + 28, cy - 20, start=30, extent=120, fill="#0f172a", outline="")
        # Big thick eyebrows!
        brow_y = -32 if self.state != "nagging" else -36
        self.canvas.create_line(cx - 22, cy + brow_y, cx - 6, cy + brow_y + 2, width=4, fill="#0f172a", capstyle=tk.ROUND)
        self.canvas.create_line(cx + 6, cy + brow_y + 2, cx + 22, cy + brow_y, width=4, fill="#0f172a", capstyle=tk.ROUND)
        # Eyes
        self.canvas.create_oval(cx - 16, cy - 24, cx - 6, cy - 14, fill="#0f172a", outline="")
        self.canvas.create_oval(cx - 14, cy - 22, cx - 10, cy - 18, fill="#ffffff", outline="")
        self.canvas.create_oval(cx + 6, cy - 24, cx + 16, cy - 14, fill="#0f172a", outline="")
        self.canvas.create_oval(cx + 8, cy - 22, cx + 12, cy - 18, fill="#ffffff", outline="")
        # Rosy cheeks
        self.canvas.create_oval(cx - 26, cy - 16, cx - 16, cy - 10, fill="#fda4af", outline="")
        self.canvas.create_oval(cx + 16, cy - 16, cx + 26, cy - 10, fill="#fda4af", outline="")
        # Mouth
        if self.state == "nagging":
            self.canvas.create_oval(cx - 8, cy - 10, cx + 8, cy + 2, fill="#ef4444", outline="#7f1d1d")
        else:
            self.canvas.create_arc(cx - 8, cy - 12, cx + 8, cy - 2, start=180, extent=180, fill="#ef4444", outline="#7f1d1d")

    def draw_doraemon(self, cx, cy):
        # Bamboo-copter
        self.canvas.create_line(cx, cy - 45, cx, cy - 38, width=2, fill="#ca8a04")
        self.canvas.create_line(cx - 16, cy - 45, cx + 16, cy - 45, width=3, fill="#facc15")
        # Blue Body
        self.canvas.create_oval(cx - 26, cy - 4, cx + 26, cy + 40, fill="#0284c7", outline="#0369a1", width=2)
        # White belly & pocket
        self.canvas.create_oval(cx - 18, cy + 4, cx + 18, cy + 34, fill="#ffffff", outline="#0284c7", width=1)
        self.canvas.create_arc(cx - 14, cy + 10, cx + 14, cy + 32, start=180, extent=180, fill="#ffffff", outline="#0284c7", width=1.5)
        # Red collar & bell
        self.canvas.create_rectangle(cx - 20, cy - 6, cx + 20, cy - 1, fill="#ef4444", outline="")
        self.canvas.create_oval(cx - 5, cy - 4, cx + 5, cy + 6, fill="#facc15", outline="#78350f")
        # Blue Head
        self.canvas.create_oval(cx - 30, cy - 40, cx + 30, cy + 4, fill="#0284c7", outline="#0369a1", width=2)
        # White face
        self.canvas.create_oval(cx - 24, cy - 34, cx + 24, cy + 2, fill="#ffffff", outline="#0369a1", width=1)
        # Big oval eyes
        self.canvas.create_oval(cx - 12, cy - 34, cx, cy - 16, fill="#ffffff", outline="#0f172a", width=1.5)
        self.canvas.create_oval(cx, cy - 34, cx + 12, cy - 16, fill="#ffffff", outline="#0f172a", width=1.5)
        self.canvas.create_oval(cx - 7, cy - 26, cx - 3, cy - 22, fill="#0f172a")
        self.canvas.create_oval(cx + 3, cy - 26, cx + 7, cy - 22, fill="#0f172a")
        # Red nose
        self.canvas.create_oval(cx - 4, cy - 19, cx + 4, cy - 11, fill="#ef4444", outline="")
        # Whiskers
        self.canvas.create_line(cx - 20, cy - 16, cx - 6, cy - 14, fill="#0f172a")
        self.canvas.create_line(cx - 22, cy - 11, cx - 6, cy - 11, fill="#0f172a")
        self.canvas.create_line(cx + 6, cy - 14, cx + 20, cy - 16, fill="#0f172a")
        self.canvas.create_line(cx + 6, cy - 11, cx + 22, cy - 11, fill="#0f172a")

    def draw_pikachu(self, cx, cy):
        # Ears with black tips
        self.canvas.create_line(cx - 16, cy - 25, cx - 28, cy - 50, width=8, fill="#facc15", capstyle=tk.ROUND)
        self.canvas.create_line(cx - 26, cy - 46, cx - 30, cy - 52, width=8, fill="#0f172a", capstyle=tk.ROUND)
        self.canvas.create_line(cx + 16, cy - 25, cx + 28, cy - 50, width=8, fill="#facc15", capstyle=tk.ROUND)
        self.canvas.create_line(cx + 26, cy - 46, cx + 30, cy - 52, width=8, fill="#0f172a", capstyle=tk.ROUND)
        # Tail
        self.canvas.create_line(cx + 22, cy + 20, cx + 36, cy + 6, width=6, fill="#facc15")
        self.canvas.create_line(cx + 36, cy + 6, cx + 32, cy - 8, width=6, fill="#facc15")
        self.canvas.create_line(cx + 32, cy - 8, cx + 48, cy - 18, width=8, fill="#facc15")
        # Body
        self.canvas.create_oval(cx - 24, cy - 8, cx + 24, cy + 42, fill="#facc15", outline="#ca8a04", width=2)
        # Head
        self.canvas.create_oval(cx - 26, cy - 36, cx + 26, cy + 4, fill="#facc15", outline="#ca8a04", width=2)
        # Red cheeks
        self.canvas.create_oval(cx - 24, cy - 14, cx - 12, cy - 2, fill="#ef4444", outline="")
        self.canvas.create_oval(cx + 12, cy - 14, cx + 24, cy - 2, fill="#ef4444", outline="")
        # Eyes
        self.canvas.create_oval(cx - 16, cy - 24, cx - 8, cy - 16, fill="#0f172a")
        self.canvas.create_oval(cx - 14, cy - 22, cx - 10, cy - 18, fill="#ffffff")
        self.canvas.create_oval(cx + 8, cy - 24, cx + 16, cy - 16, fill="#0f172a")
        self.canvas.create_oval(cx + 10, cy - 22, cx + 14, cy - 18, fill="#ffffff")

    def draw_luffy(self, cx, cy):
        # Straw hat
        self.canvas.create_oval(cx - 36, cy - 42, cx + 36, cy - 26, fill="#facc15", outline="#ca8a04", width=2)
        self.canvas.create_oval(cx - 20, cy - 50, cx + 20, cy - 32, fill="#facc15", outline="#ca8a04", width=2)
        self.canvas.create_rectangle(cx - 18, cy - 36, cx + 18, cy - 32, fill="#ef4444", outline="")
        # Head & Hair
        self.canvas.create_oval(cx - 22, cy - 32, cx + 22, cy + 4, fill="#fed7aa", outline="#ea580c", width=2)
        # Left eye scar
        self.canvas.create_line(cx - 14, cy - 12, cx - 6, cy - 10, width=2, fill="#7c2d12")
        # Eyes
        self.canvas.create_oval(cx - 14, cy - 20, cx - 6, cy - 12, fill="#0f172a")
        self.canvas.create_oval(cx + 6, cy - 20, cx + 14, cy - 12, fill="#0f172a")
        # Big D-Grin
        self.canvas.create_arc(cx - 12, cy - 12, cx + 12, cy + 2, start=180, extent=180, fill="#ffffff", outline="#0f172a", width=1.5)
        # Red vest & Blue shorts
        self.canvas.create_rectangle(cx - 18, cy + 4, cx + 18, cy + 26, fill="#ef4444", outline="#b91c1c", width=1.5)
        self.canvas.create_rectangle(cx - 16, cy + 26, cx + 16, cy + 40, fill="#2563eb", outline="#1d4ed8", width=1.5)

    def draw_hattori(self, cx, cy):
        # Ninja hood
        self.canvas.create_oval(cx - 26, cy - 36, cx + 26, cy + 4, fill="#1d4ed8", outline="#1e40af", width=2)
        # Face opening
        self.canvas.create_oval(cx - 18, cy - 28, cx + 18, cy + 2, fill="#ffffff", outline="#1e40af", width=1.5)
        # Headband with red circle
        self.canvas.create_rectangle(cx - 18, cy - 34, cx + 18, cy - 28, fill="#ffffff", outline="#94a3b8")
        self.canvas.create_oval(cx - 3, cy - 33, cx + 3, cy - 29, fill="#ef4444", outline="")
        # Swirl cheeks 🌀
        self.canvas.create_oval(cx - 14, cy - 14, cx - 6, cy - 6, outline="#ef4444", width=1.5)
        self.canvas.create_oval(cx + 6, cy - 14, cx + 14, cy - 6, outline="#ef4444", width=1.5)
        # Eyes
        self.canvas.create_oval(cx - 12, cy - 24, cx - 6, cy - 16, fill="#0f172a")
        self.canvas.create_oval(cx + 6, cy - 24, cx + 12, cy - 16, fill="#0f172a")
        # Body & Red scarf
        self.canvas.create_rectangle(cx - 18, cy + 4, cx + 18, cy + 38, fill="#1d4ed8", outline="#1e40af", width=2)
        self.canvas.create_rectangle(cx - 14, cy + 2, cx + 14, cy + 8, fill="#ef4444", outline="")

    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    char = sys.argv[1] if len(sys.argv) > 1 else "Shinchan"
    c_type = sys.argv[2] if len(sys.argv) > 2 else "shinchan"
    pet = DesktopPet(character_name=char, character_type=c_type)
    pet.run()
