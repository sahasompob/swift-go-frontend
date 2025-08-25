import BasePage from "../../components/layout/BasePage";

export default function BookingPage() {
  return (
    <BasePage title="Dashboard">
      <h2 className="text-2xl font-bold mb-4">Booking</h2>
      <p>ยินดีต้อนรับสู่หน้า Booking!</p>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow">Card 1</div>
        <div className="bg-white p-4 rounded-lg shadow">Card 2</div>
        <div className="bg-white p-4 rounded-lg shadow">Card 3</div>
      </div>
    </BasePage>
  );
}