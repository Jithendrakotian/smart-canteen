/**
 * AI-based food recommendation using simple rule-based logic.
 * Suggests items based on order history and time of day.
 */

export function getRecommendations(menuItems, orderHistory) {
  const hour = new Date().getHours();
  const timeCategory =
    hour >= 6 && hour < 11
      ? "breakfast"
      : hour >= 11 && hour < 16
      ? "lunch"
      : "snacks";

  // Count how often the user has ordered each item
  const orderCounts = {};
  orderHistory.forEach((order) => {
    (order.items || []).forEach((item) => {
      orderCounts[item.itemId] = (orderCounts[item.itemId] || 0) + item.quantity;
    });
  });

  // Score each menu item
  const scored = menuItems
    .filter((item) => item.available)
    .map((item) => {
      let score = 0;
      // Boost items matching time category
      if (
        item.category &&
        item.category.toLowerCase().includes(timeCategory)
      ) {
        score += 10;
      }
      // Boost frequently ordered items
      score += (orderCounts[item.itemId] || 0) * 3;
      // Boost affordable items
      if (item.price <= 60) score += 2;
      return { ...item, score };
    });

  return scored.sort((a, b) => b.score - a.score).slice(0, 4);
}

export function getTimeSuggestion() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 11) return "Good morning! Start with a healthy breakfast 🍳";
  if (hour >= 11 && hour < 14) return "Lunch time! Check out today's specials 🍱";
  if (hour >= 14 && hour < 17) return "Afternoon snack time! ☕";
  if (hour >= 17 && hour < 21) return "Evening meals are ready! 🍽️";
  return "Late night cravings? 🌙";
}
