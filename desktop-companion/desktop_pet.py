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
        # Right click to close / menu
        self.canvas.bind("<Button-3>", self.show_context_menu)
        # Keyboard shortcuts to stop anytime
        self.root.bind("<Escape>", lambda e: self.stop_pet())
        self.root.bind("<q>", lambda e: self.stop_pet())
        
    def update_position(self):
        self.root.geometry(f"{self.width}x{self.height}+{int(self.x)}+{int(self.y)}")

    def on_click(self, event):
        # Check if clicked on STOP button (top-right of bubble)
        if 165 <= event.x <= 235 and 4 <= event.y <= 28:
            self.stop_pet()
            return

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
        # If clicked on STOP button, do not process
        if 165 <= event.x <= 235 and 4 <= event.y <= 28:
            return

        if not getattr(self, "is_dragging", False):
            # Clicked without dragging: Navigate to Web Page!
            self.navigate_to_app()

    def stop_pet(self):
        """Immediately stop and dismiss the desktop pet from the screen"""
        try:
            self.root.destroy()
        except:
            pass

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
        if len(text_disp) > 26:
            text_disp = text_disp[:24] + "..."
        self.canvas.create_text(92, bubble_y + 16, text=text_disp, font=("Segoe UI", 8, "bold"), fill="#1e293b", width=145)
        self.canvas.create_text(95, bubble_y + 32, text="👉 CLICK ME TO OPEN TOONMATE 👈", font=("Segoe UI", 7, "bold"), fill="#dc2626")

        # Draw prominent STOP Button (click to dismiss desktop pet)
        self.canvas.create_rectangle(168, 6, 232, 26, fill="#ef4444", outline="#b91c1c", width=1.5)
        self.canvas.create_text(200, 16, text="🛑 STOP", font=("Segoe UI", 7, "bold"), fill="#ffffff")

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
        # Shinchan: Authentic Crayon Shin-chan cartoon model
        # Legs & White Socks & Yellow Shoes
        self.canvas.create_rectangle(cx - 14, cy + 32, cx - 4, cy + 46, fill="#fde2c7", outline="#18181b", width=2)
        self.canvas.create_rectangle(cx + 4, cy + 32, cx + 14, cy + 46, fill="#fde2c7", outline="#18181b", width=2)
        # White socks
        self.canvas.create_rectangle(cx - 15, cy + 40, cx - 3, cy + 45, fill="#ffffff", outline="#18181b", width=1.5)
        self.canvas.create_rectangle(cx + 3, cy + 40, cx + 15, cy + 45, fill="#ffffff", outline="#18181b", width=1.5)
        # Yellow shoes with white sole
        self.canvas.create_oval(cx - 18, cy + 44, cx - 2, cy + 52, fill="#facc15", outline="#18181b", width=1.8)
        self.canvas.create_oval(cx + 2, cy + 44, cx + 18, cy + 52, fill="#facc15", outline="#18181b", width=1.8)
        self.canvas.create_line(cx - 16, cy + 50, cx - 4, cy + 50, fill="#ffffff", width=1.8)
        self.canvas.create_line(cx + 4, cy + 50, cx + 16, cy + 50, fill="#ffffff", width=1.8)

        # Yellow shorts with waistband
        self.canvas.create_polygon(cx - 20, cy + 18, cx + 20, cy + 18, cx + 18, cy + 34, cx + 2, cy + 34, cx, cy + 28, cx - 2, cy + 34, cx - 18, cy + 34, fill="#facc15", outline="#18181b", width=2)
        self.canvas.create_line(cx - 18, cy + 21, cx + 18, cy + 21, fill="#ca8a04", width=1)

        # Red T-shirt & sleeves
        self.canvas.create_rectangle(cx - 22, cy - 6, cx + 22, cy + 18, fill="#ef4444", outline="#18181b", width=2)
        # Yellow collar rim
        self.canvas.create_arc(cx - 8, cy - 10, cx + 8, cy - 4, start=180, extent=180, style=tk.ARC, outline="#facc15", width=2)
        # Chubby arms
        self.canvas.create_oval(cx - 28, cy - 2, cx - 18, cy + 12, fill="#ef4444", outline="#18181b", width=1.5)
        self.canvas.create_oval(cx + 18, cy - 2, cx + 28, cy + 12, fill="#ef4444", outline="#18181b", width=1.5)
        self.canvas.create_oval(cx - 29, cy + 8, cx - 21, cy + 16, fill="#fde2c7", outline="#18181b", width=1.5)
        self.canvas.create_oval(cx + 21, cy + 8, cx + 29, cy + 16, fill="#fde2c7", outline="#18181b", width=1.5)

        # Potato Head shape (smooth polygon for authentic Shinchan cheek silhouette)
        head_pts = [
            cx + 24, cy - 20,
            cx + 14, cy - 38,
            cx - 8, cy - 38,
            cx - 26, cy - 26,
            cx - 36, cy - 12,
            cx - 38, cy - 2,
            cx - 30, cy + 10,
            cx - 14, cy + 16,
            cx + 14, cy + 14,
            cx + 24, cy + 2,
            cx + 26, cy - 8
        ]
        self.canvas.create_polygon(head_pts, smooth=True, fill="#fde2c7", outline="#18181b", width=2.2)

        # Right ear
        self.canvas.create_oval(cx + 22, cy - 12, cx + 30, cy + 2, fill="#fde2c7", outline="#18181b", width=1.8)
        self.canvas.create_line(cx + 24, cy - 6, cx + 27, cy - 3, fill="#ea580c", width=1.2)

        # Black cropped hair
        hair_pts = [
            cx - 24, cy - 24,
            cx - 6, cy - 38,
            cx + 14, cy - 38,
            cx + 24, cy - 20,
            cx + 23, cy - 10,
            cx + 18, cy - 24,
            cx - 6, cy - 30,
            cx - 20, cy - 20
        ]
        self.canvas.create_polygon(hair_pts, smooth=True, fill="#09090b", outline="")

        # Thick, iconic black eyebrows!
        brow_y = -26 if self.state != "nagging" else -29
        self.canvas.create_line(cx - 24, cy + brow_y + 1, cx - 8, cy + brow_y - 2, width=5, fill="#09090b", capstyle=tk.ROUND)
        self.canvas.create_line(cx + 4, cy + brow_y - 2, cx + 20, cy + brow_y + 1, width=5, fill="#09090b", capstyle=tk.ROUND)

        # Anime Eyes with white sclera, black pupil, and white shine dot
        if self.state == "sleeping":
            self.canvas.create_arc(cx - 20, cy - 18, cx - 8, cy - 10, start=0, extent=180, style=tk.ARC, outline="#18181b", width=2)
            self.canvas.create_arc(cx + 4, cy - 19, cx + 16, cy - 11, start=0, extent=180, style=tk.ARC, outline="#18181b", width=2)
        else:
            # Left Eye
            self.canvas.create_oval(cx - 20, cy - 20, cx - 8, cy - 8, fill="#ffffff", outline="#18181b", width=1.8)
            self.canvas.create_oval(cx - 17, cy - 18, cx - 9, cy - 10, fill="#09090b")
            self.canvas.create_oval(cx - 16, cy - 17, cx - 13, cy - 14, fill="#ffffff")
            # Right Eye
            self.canvas.create_oval(cx + 5, cy - 21, cx + 17, cy - 9, fill="#ffffff", outline="#18181b", width=1.8)
            self.canvas.create_oval(cx + 7, cy - 19, cx + 15, cy - 11, fill="#09090b")
            self.canvas.create_oval(cx + 8, cy - 18, cx + 11, cy - 15, fill="#ffffff")

        # Rosy Cheeks
        self.canvas.create_oval(cx - 34, cy - 4, cx - 22, cy + 4, fill="#fb7185", outline="")
        self.canvas.create_oval(cx + 12, cy - 6, cx + 22, cy + 2, fill="#fb7185", outline="")

        # Iconic Sideways Mouth
        if self.state == "nagging":
            self.canvas.create_oval(cx - 18, cy - 2, cx - 4, cy + 10, fill="#ef4444", outline="#18181b", width=1.5)
            self.canvas.create_oval(cx - 15, cy + 3, cx - 7, cy + 9, fill="#f472b6", outline="")
        else:
            self.canvas.create_arc(cx - 20, cy - 6, cx - 4, cy + 6, start=180, extent=180, fill="#ef4444", outline="#18181b", width=1.5)
            self.canvas.create_arc(cx - 17, cy - 1, cx - 7, cy + 5, start=180, extent=180, fill="#f472b6", outline="")

    def draw_doraemon(self, cx, cy):
        # Doraemon: Authentic Fujiko F. Fujio cartoon model
        # Spinning Bamboo-copter
        self.canvas.create_line(cx, cy - 44, cx, cy - 36, width=2, fill="#ca8a04")
        self.canvas.create_oval(cx - 6, cy - 37, cx + 6, cy - 34, fill="#eab308", outline="#18181b")
        rotor_dx = int(math.sin(self.step_counter * 0.5) * 18)
        self.canvas.create_line(cx - rotor_dx, cy - 44, cx + rotor_dx, cy - 44, width=3.5, fill="#facc15", capstyle=tk.ROUND)

        # White feet
        self.canvas.create_oval(cx - 24, cy + 36, cx - 2, cy + 48, fill="#ffffff", outline="#18181b", width=2)
        self.canvas.create_oval(cx + 2, cy + 36, cx + 24, cy + 48, fill="#ffffff", outline="#18181b", width=2)

        # Blue Body
        self.canvas.create_oval(cx - 28, cy - 2, cx + 28, cy + 42, fill="#0284c7", outline="#18181b", width=2.2)

        # White belly & 4D pocket
        self.canvas.create_oval(cx - 20, cy + 6, cx + 20, cy + 36, fill="#ffffff", outline="#18181b", width=1.5)
        self.canvas.create_arc(cx - 15, cy + 12, cx + 15, cy + 34, start=180, extent=180, fill="#ffffff", outline="#18181b", width=1.8)
        self.canvas.create_line(cx - 15, cy + 23, cx + 15, cy + 23, fill="#18181b", width=1.5)

        # Round white paws (hands)
        self.canvas.create_oval(cx - 38, cy + 8, cx - 22, cy + 24, fill="#ffffff", outline="#18181b", width=2)
        self.canvas.create_oval(cx + 22, cy + 8, cx + 38, cy + 24, fill="#ffffff", outline="#18181b", width=2)

        # Red collar & golden jingle bell
        self.canvas.create_rectangle(cx - 24, cy - 5, cx + 24, cy + 1, fill="#ef4444", outline="#18181b", width=1.5)
        self.canvas.create_oval(cx - 6, cy - 3, cx + 6, cy + 9, fill="#facc15", outline="#18181b", width=1.5)
        self.canvas.create_line(cx - 4, cy + 1, cx + 4, cy + 1, fill="#92400e", width=1)
        self.canvas.create_oval(cx - 1.5, cy + 3, cx + 1.5, cy + 6, fill="#78350f", outline="")

        # Blue Head
        self.canvas.create_oval(cx - 32, cy - 38, cx + 32, cy + 8, fill="#0284c7", outline="#18181b", width=2.2)

        # White Face Mask
        self.canvas.create_oval(cx - 26, cy - 32, cx + 26, cy + 6, fill="#ffffff", outline="#18181b", width=1.8)

        # Touching Oval Eyes with Pupils & Shine
        self.canvas.create_oval(cx - 13, cy - 34, cx, cy - 14, fill="#ffffff", outline="#18181b", width=1.8)
        self.canvas.create_oval(cx, cy - 34, cx + 13, cy - 14, fill="#ffffff", outline="#18181b", width=1.8)
        self.canvas.create_oval(cx - 7, cy - 24, cx - 2, cy - 19, fill="#09090b")
        self.canvas.create_oval(cx - 6, cy - 23, cx - 4, cy - 21, fill="#ffffff")
        self.canvas.create_oval(cx + 2, cy - 24, cx + 7, cy - 19, fill="#09090b")
        self.canvas.create_oval(cx + 3, cy - 23, cx + 5, cy - 21, fill="#ffffff")

        # Shiny Red Nose
        self.canvas.create_oval(cx - 5, cy - 18, cx + 5, cy - 8, fill="#ef4444", outline="#18181b", width=1.2)
        self.canvas.create_oval(cx - 2.5, cy - 16, cx - 0.5, cy - 14, fill="#ffffff", outline="")

        # Vertical Philtrum Line
        self.canvas.create_line(cx, cy - 8, cx, cy + 2, fill="#18181b", width=1.8)

        # 6 Whiskers (3 on each side)
        self.canvas.create_line(cx - 24, cy - 12, cx - 6, cy - 9, fill="#18181b", width=1.5)
        self.canvas.create_line(cx - 25, cy - 6, cx - 6, cy - 6, fill="#18181b", width=1.5)
        self.canvas.create_line(cx - 24, cy, cx - 6, cy - 3, fill="#18181b", width=1.5)

        self.canvas.create_line(cx + 6, cy - 9, cx + 24, cy - 12, fill="#18181b", width=1.5)
        self.canvas.create_line(cx + 6, cy - 6, cx + 25, cy - 6, fill="#18181b", width=1.5)
        self.canvas.create_line(cx + 6, cy - 3, cx + 24, cy, fill="#18181b", width=1.5)

        # Giant D-Smile with Pink Tongue
        self.canvas.create_arc(cx - 16, cy - 4, cx + 16, cy + 10, start=180, extent=180, fill="#dc2626", outline="#18181b", width=1.8)
        self.canvas.create_arc(cx - 8, cy + 2, cx + 8, cy + 8, start=180, extent=180, fill="#fb7185", outline="")

    def draw_pikachu(self, cx, cy):
        # Pikachu: Authentic Pokémon anime model
        # Lightning Bolt Tail
        tail_pts = [
            cx + 20, cy + 18,
            cx + 34, cy + 6,
            cx + 28, cy - 6,
            cx + 46, cy - 18,
            cx + 42, cy - 24,
            cx + 22, cy - 8,
            cx + 28, cy + 4,
            cx + 14, cy + 12
        ]
        self.canvas.create_polygon(tail_pts, fill="#facc15", outline="#18181b", width=2)
        # Brown tail base
        self.canvas.create_polygon([cx + 14, cy + 12, cx + 20, cy + 18, cx + 16, cy + 24, cx + 10, cy + 18], fill="#78350f", outline="#18181b", width=1.5)

        # Flat feet
        self.canvas.create_oval(cx - 22, cy + 36, cx - 4, cy + 46, fill="#facc15", outline="#18181b", width=2)
        self.canvas.create_oval(cx + 4, cy + 36, cx + 22, cy + 46, fill="#facc15", outline="#18181b", width=2)

        # Body
        self.canvas.create_oval(cx - 26, cy - 4, cx + 26, cy + 42, fill="#facc15", outline="#18181b", width=2.2)

        # Brown stripes on back
        self.canvas.create_arc(cx - 22, cy + 8, cx - 2, cy + 18, start=0, extent=90, style=tk.ARC, outline="#78350f", width=3)
        self.canvas.create_arc(cx - 22, cy + 18, cx - 2, cy + 28, start=0, extent=90, style=tk.ARC, outline="#78350f", width=3)

        # Forepaws
        self.canvas.create_oval(cx - 14, cy + 8, cx - 4, cy + 20, fill="#facc15", outline="#18181b", width=1.8)
        self.canvas.create_oval(cx + 4, cy + 8, cx + 14, cy + 20, fill="#facc15", outline="#18181b", width=1.8)

        # Ears with Diagonal Black Tips
        # Left Ear
        self.canvas.create_polygon([cx - 16, cy - 24, cx - 34, cy - 50, cx - 22, cy - 32], fill="#facc15", outline="#18181b", width=2)
        self.canvas.create_polygon([cx - 28, cy - 42, cx - 34, cy - 50, cx - 30, cy - 46], fill="#18181b", outline="")
        # Right Ear
        self.canvas.create_polygon([cx + 16, cy - 24, cx + 34, cy - 50, cx + 22, cy - 32], fill="#facc15", outline="#18181b", width=2)
        self.canvas.create_polygon([cx + 28, cy - 42, cx + 34, cy - 50, cx + 30, cy - 46], fill="#18181b", outline="")

        # Chubby Head
        self.canvas.create_oval(cx - 28, cy - 36, cx + 28, cy + 4, fill="#facc15", outline="#18181b", width=2.2)

        # Red Cheek Pouches
        self.canvas.create_oval(cx - 26, cy - 14, cx - 14, cy - 2, fill="#ef4444", outline="#18181b", width=1.5)
        self.canvas.create_oval(cx + 14, cy - 14, cx + 26, cy - 2, fill="#ef4444", outline="#18181b", width=1.5)

        # Eyes with shine dots
        self.canvas.create_oval(cx - 18, cy - 24, cx - 8, cy - 14, fill="#1e1b4b", outline="#18181b", width=1.5)
        self.canvas.create_oval(cx - 16, cy - 22, cx - 12, cy - 18, fill="#ffffff")
        self.canvas.create_oval(cx + 8, cy - 24, cx + 18, cy - 14, fill="#1e1b4b", outline="#18181b", width=1.5)
        self.canvas.create_oval(cx + 10, cy - 22, cx + 14, cy - 18, fill="#ffffff")

        # Tiny Nose & Cat Mouth (ω)
        self.canvas.create_polygon([cx, cy - 15, cx - 1.5, cy - 17, cx + 1.5, cy - 17], fill="#18181b")
        self.canvas.create_arc(cx - 6, cy - 12, cx, cy - 6, start=180, extent=180, style=tk.ARC, outline="#18181b", width=1.8)
        self.canvas.create_arc(cx, cy - 12, cx + 6, cy - 6, start=180, extent=180, style=tk.ARC, outline="#18181b", width=1.8)

    def draw_luffy(self, cx, cy):
        # Luffy: Authentic One Piece Mugiwara model
        # Legs & Sandals
        self.canvas.create_rectangle(cx - 14, cy + 30, cx - 4, cy + 44, fill="#fed7aa", outline="#18181b", width=2)
        self.canvas.create_rectangle(cx + 4, cy + 30, cx + 14, cy + 44, fill="#fed7aa", outline="#18181b", width=2)
        self.canvas.create_oval(cx - 16, cy + 42, cx - 2, cy + 48, fill="#ca8a04", outline="#18181b", width=1.5)
        self.canvas.create_oval(cx + 2, cy + 42, cx + 16, cy + 48, fill="#ca8a04", outline="#18181b", width=1.5)

        # Denim Blue Shorts with White Cuffs
        self.canvas.create_rectangle(cx - 18, cy + 18, cx + 18, cy + 32, fill="#2563eb", outline="#18181b", width=2)
        self.canvas.create_oval(cx - 16, cy + 28, cx - 2, cy + 34, fill="#ffffff", outline="#18181b", width=1.5)
        self.canvas.create_oval(cx + 2, cy + 28, cx + 16, cy + 34, fill="#ffffff", outline="#18181b", width=1.5)

        # Bare chest & open red vest
        self.canvas.create_rectangle(cx - 16, cy - 4, cx + 16, cy + 18, fill="#fed7aa", outline="")
        self.canvas.create_rectangle(cx - 20, cy - 4, cx - 12, cy + 18, fill="#ef4444", outline="#18181b", width=1.8)
        self.canvas.create_rectangle(cx + 12, cy - 4, cx + 20, cy + 18, fill="#ef4444", outline="#18181b", width=1.8)
        # Yellow sash
        self.canvas.create_rectangle(cx - 18, cy + 15, cx + 18, cy + 20, fill="#facc15", outline="#18181b", width=1.5)

        # Head & Spiky Hair
        self.canvas.create_oval(cx - 22, cy - 30, cx + 22, cy + 4, fill="#fed7aa", outline="#18181b", width=2.2)
        # Hair spikes
        hair_pts = [cx - 24, cy - 18, cx - 28, cy - 28, cx - 18, cy - 26, cx - 12, cy - 34, cx, cy - 28, cx + 12, cy - 34, cx + 18, cy - 26, cx + 28, cy - 28, cx + 24, cy - 18]
        self.canvas.create_polygon(hair_pts, fill="#09090b", outline="")

        # Straw Hat (Mugiwara)
        self.canvas.create_oval(cx - 38, cy - 36, cx + 38, cy - 22, fill="#f59e0b", outline="#18181b", width=2.2)
        self.canvas.create_arc(cx - 22, cy - 48, cx + 22, cy - 26, start=0, extent=180, fill="#f59e0b", outline="#18181b", width=2)
        self.canvas.create_rectangle(cx - 20, cy - 32, cx + 20, cy - 28, fill="#ef4444", outline="")

        # Eyes & Left Eye Scar
        self.canvas.create_oval(cx - 14, cy - 18, cx - 6, cy - 10, fill="#ffffff", outline="#18181b", width=1.5)
        self.canvas.create_oval(cx - 12, cy - 16, cx - 7, cy - 11, fill="#09090b")
        self.canvas.create_oval(cx + 6, cy - 18, cx + 14, cy - 10, fill="#ffffff", outline="#18181b", width=1.5)
        self.canvas.create_oval(cx + 7, cy - 16, cx + 12, cy - 11, fill="#09090b")

        # Childhood stitch scar under left eye
        self.canvas.create_line(cx - 14, cy - 7, cx - 6, cy - 6, fill="#7c2d12", width=1.8)
        self.canvas.create_line(cx - 12, cy - 9, cx - 12, cy - 5, fill="#7c2d12", width=1.5)
        self.canvas.create_line(cx - 8, cy - 9, cx - 8, cy - 5, fill="#7c2d12", width=1.5)

        # Signature Toothy D-Smile
        self.canvas.create_arc(cx - 14, cy - 8, cx + 14, cy + 4, start=180, extent=180, fill="#ffffff", outline="#18181b", width=2)
        self.canvas.create_line(cx - 14, cy - 2, cx + 14, cy - 2, fill="#18181b", width=1.5)
        self.canvas.create_line(cx - 5, cy - 2, cx - 5, cy + 3, fill="#18181b", width=1)
        self.canvas.create_line(cx, cy - 2, cx, cy + 4, fill="#18181b", width=1)
        self.canvas.create_line(cx + 5, cy - 2, cx + 5, cy + 3, fill="#18181b", width=1)

    def draw_hattori(self, cx, cy):
        # Ninja Hattori: Authentic Fujiko Fujio A model
        # Ninja Katana sword on back
        self.canvas.create_line(cx - 28, cy - 24, cx + 28, cy + 32, fill="#334155", width=4.5)
        self.canvas.create_rectangle(cx - 30, cy - 26, cx - 22, cy - 18, fill="#facc15", outline="#18181b")

        # Blue trousers & white gaiters
        self.canvas.create_rectangle(cx - 14, cy + 30, cx - 4, cy + 42, fill="#1e40af", outline="#18181b", width=2)
        self.canvas.create_rectangle(cx + 4, cy + 30, cx + 14, cy + 42, fill="#1e40af", outline="#18181b", width=2)
        self.canvas.create_rectangle(cx - 15, cy + 36, cx - 3, cy + 42, fill="#ffffff", outline="#18181b", width=1.5)
        self.canvas.create_rectangle(cx + 3, cy + 36, cx + 15, cy + 42, fill="#ffffff", outline="#18181b", width=1.5)

        # Blue Kimono Tunic & Red Obi
        self.canvas.create_rectangle(cx - 18, cy + 2, cx + 18, cy + 30, fill="#1e40af", outline="#18181b", width=2)
        self.canvas.create_polygon([cx, cy + 12, cx - 6, cy + 2, cx + 6, cy + 2], fill="#ffffff", outline="")
        self.canvas.create_rectangle(cx - 18, cy + 22, cx + 18, cy + 27, fill="#ef4444", outline="#18181b", width=1.5)

        # Red Puffy Scarf
        self.canvas.create_oval(cx - 20, cy - 2, cx + 20, cy + 8, fill="#ef4444", outline="#18181b", width=1.8)
        self.canvas.create_polygon([cx + 14, cy + 2, cx + 26, cy + 10, cx + 18, cy + 18], fill="#ef4444", outline="#18181b")

        # Hands in Ninja Mudra
        self.canvas.create_rectangle(cx - 4, cy + 10, cx + 4, cy + 18, fill="#fed7aa", outline="#18181b", width=1.5)

        # Blue Ninja Cowl (Zukin)
        self.canvas.create_oval(cx - 26, cy - 36, cx + 26, cy + 4, fill="#1e40af", outline="#18181b", width=2.2)

        # White Face Opening
        self.canvas.create_oval(cx - 20, cy - 30, cx + 20, cy + 2, fill="#ffffff", outline="#18181b", width=1.8)

        # White Forehead Band with Red Sun Crest
        self.canvas.create_rectangle(cx - 18, cy - 32, cx + 18, cy - 26, fill="#ffffff", outline="#18181b", width=1.5)
        self.canvas.create_oval(cx - 3, cy - 31, cx + 3, cy - 27, fill="#ef4444", outline="")

        # Authentic Concentric Swirl Cheeks 🌀
        self.canvas.create_oval(cx - 16, cy - 14, cx - 8, cy - 6, outline="#ef4444", width=1.8)
        self.canvas.create_oval(cx + 8, cy - 14, cx + 16, cy - 6, outline="#ef4444", width=1.8)

        # Expressive Eyes
        self.canvas.create_oval(cx - 14, cy - 22, cx - 6, cy - 12, fill="#ffffff", outline="#18181b", width=1.5)
        self.canvas.create_oval(cx - 12, cy - 20, cx - 7, cy - 14, fill="#09090b")
        self.canvas.create_oval(cx - 11, cy - 19, cx - 9, cy - 17, fill="#ffffff")

        self.canvas.create_oval(cx + 6, cy - 22, cx + 14, cy - 12, fill="#ffffff", outline="#18181b", width=1.5)
        self.canvas.create_oval(cx + 7, cy - 20, cx + 12, cy - 14, fill="#09090b")
        self.canvas.create_oval(cx + 8, cy - 19, cx + 10, cy - 17, fill="#ffffff")

        # Ninja Mouth
        self.canvas.create_line(cx - 6, cy - 4, cx + 6, cy - 4, fill="#18181b", width=2)

    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    char = sys.argv[1] if len(sys.argv) > 1 else "Shinchan"
    c_type = sys.argv[2] if len(sys.argv) > 2 else "shinchan"
    pet = DesktopPet(character_name=char, character_type=c_type)
    pet.run()
