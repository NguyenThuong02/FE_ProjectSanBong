import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common'; // Thêm import CommonModule

@Component({
  selector: 'app-info-contact',
  imports: [CommonModule], 
  standalone: true, 
  templateUrl: './info-contact.component.html',
  styleUrls: ['./info-contact.component.scss'],
})
export class InfoContactComponent implements OnInit, AfterViewInit {
  listContact: any[] = [
    {
      name: 'Sân bóng Đầm Hồng',
      nameOwner: 'Nguyễn Văn A',
      address: '23 Đầm Hồng, Hoàng Mai, Hà Nội',
      phone: '0123456789',
      email: 'nguyenvana00@gmail.com',
      lat: 20.9767,
      lng: 105.8537
    },
    {
      name: 'Sân bóng Tây Hồ',
      nameOwner: 'Nguyễn Văn B',
      address: '18 An Dương, Tây Hồ, Hà Nội',
      phone: '0123456789',
      email: 'nguyenvanb00@gmail.com',
      lat: 21.0635,
      lng: 105.8223
    },
    {
      name: 'Sân Thiên Long',
      nameOwner: 'Phạm Thanh Bình',
      address: 'Cầu Giấy, Hà Nội',
      phone: '0123456789',
      email: 'phamthanhbinh00@gmail.com',
      lat: 21.0295,
      lng: 105.7973
    }
  ];
  
  private map!: L.Map;
  private customIcon = L.icon({
    iconUrl: 'assets/img/location.webp', 
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [21.0285, 105.8542], // Tọa độ trung tâm Hà Nội
      zoom: 12, // Zoom tập trung vào Hà Nội
      zoomControl: true
    });

    // Thêm tile layer (bản đồ nền)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // Thêm marker từ danh sách sân bóng
    this.listContact.forEach((location) => {
      L.marker([location.lat, location.lng], { icon: this.customIcon })
        .addTo(this.map)
        .bindPopup(`<b>${location.name}</b><br>${location.address}`);
    });
  }

  goToLocation(lat: number, lng: number) {
    if (this.map) {
      this.map.flyTo([lat, lng], 15);
    }
  }
}