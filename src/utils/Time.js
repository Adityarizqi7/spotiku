export function dayConvert() {
    
    const now = new Date();
    const hour = now.getHours();

    let greeting;

    if (hour >= 5 && hour < 12) {
        greeting = "Good morning";
    } else if (hour >= 12 && hour < 18) {
    greeting = "Good afternoon";
    } else if (hour >= 18 && hour < 20) {
        greeting = "Good evening";
    } else {
        greeting = "Good night";
    }

    return greeting
      
}