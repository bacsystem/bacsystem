import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

export interface TeamMember {
  id: number;
  nameKey: string;
  roleKey: string;
  bioKey: string;
  avatar: string;
  linkedin: string;
  github: string;
  twitter: string;
  colorClass: 'blue' | 'teal' | 'purple' | 'indigo';
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent {
  readonly members: TeamMember[] = [
    {
      id: 1,
      nameKey: 'application.team.members.member1.name',
      roleKey: 'application.team.members.member1.role',
      bioKey:  'application.team.members.member1.bio',
      avatar: 'assets/img/bacsystem/bacsystem-team-1.jpg',
      linkedin: '#', github: '#', twitter: '#',
      colorClass: 'blue',
    },
    {
      id: 2,
      nameKey: 'application.team.members.member2.name',
      roleKey: 'application.team.members.member2.role',
      bioKey:  'application.team.members.member2.bio',
      avatar: 'assets/img/bacsystem/bacsystem-team-2.jpg',
      linkedin: '#', github: '#', twitter: '#',
      colorClass: 'teal',
    },
    {
      id: 3,
      nameKey: 'application.team.members.member3.name',
      roleKey: 'application.team.members.member3.role',
      bioKey:  'application.team.members.member3.bio',
      avatar: 'assets/img/bacsystem/bacsystem-team-3.jpg',
      linkedin: '#', github: '#', twitter: '#',
      colorClass: 'purple',
    },
    {
      id: 4,
      nameKey: 'application.team.members.member4.name',
      roleKey: 'application.team.members.member4.role',
      bioKey:  'application.team.members.member4.bio',
      avatar: 'assets/img/bacsystem/bacsystem-team-4.jpg',
      linkedin: '#', github: '#', twitter: '#',
      colorClass: 'indigo',
    },
  ];
}
