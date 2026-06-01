import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PublicService } from '../../../services/public/public.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: any[];
}
@Component({
  selector: 'app-chat-bot',
    imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    RouterLink
  ],
  
  templateUrl: './chat-bot.html',
  styleUrl: './chat-bot.css',
})
export class ChatBot implements OnInit, AfterViewChecked {
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;
  
  messages: ChatMessage[] = [];
  newMessage: string = '';
  isOpen: boolean = false;
  isLoading: boolean = false;

  constructor(private publicService: PublicService) {}

  ngOnInit(): void {
    this.addWelcomeMessage();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  addWelcomeMessage(): void {
    this.messages.push({
      text: "Bonjour ! 👋 Je suis votre assistant commercial. Je peux vous aider à trouver des produits, vous faire des suggestions, ou répondre à vos questions. Que cherchez-vous aujourd'hui ?",
      isUser: false,
      timestamp: new Date()
    });
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    // Ajouter le message de l'utilisateur
    this.messages.push({
      text: this.newMessage,
      isUser: true,
      timestamp: new Date()
    });

    const userMessage = this.newMessage;
    this.newMessage = '';
    this.isLoading = true;

    // Envoyer au backend
    this.publicService.sendMessage(userMessage).subscribe({
      next: (response) => {
        this.messages.push({
          text: response.message,
          isUser: false,
          timestamp: new Date(),
          suggestions: response.suggestions
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.messages.push({
          text: "Désolé, une erreur s'est produite. Veuillez réessayer.",
          isUser: false,
          timestamp: new Date()
        });
        this.isLoading = false;
      }
    });
  }

  private scrollToBottom(): void {
    try {
      this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
}
