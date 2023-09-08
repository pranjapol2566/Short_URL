# วิธีติดตั้ง

1.ติดตั้ง node_modules โดยพิมคำสั่งใน Terminal ว่า Npm install<br>
2.เพิ่มไฟล์ที่ชื่อว่า .env แล้วพิมพ์ตัวแปรตามนี้<br>
    > MONGODB_CONNECT_URI= และ<br>
    > PORT=5000 <br>
3.ไปที่ไฟล์ index.ejs บรรทัดที่ 62 ให้เปลี่ยนตามนี้ `<a href="https://www.facebook.com/sharer/sharer.php?u=<%= shortUrl.Full_Url %>" target="_blank">` <br>
4.ไปที่ไฟล์ server.js บรรทัดที่ 53 ให้เปลี่ยนตามนี้ `qrcode.toDataURL(shortUrl.Full_Url, (err, qrCodeData) => {` <br>
5.ตอนรันโค้ด ให้ใช้คำสั่ง node server.js หรือ npm run devStart