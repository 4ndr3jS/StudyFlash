async function getFlashcardsPerDay(days = 7) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - (days - 1));

    console.log("Fetching flashcard sets from:", fromDate.toISOString());

    const { data, error } = await supabase
        .from('flashcard_sets')
        .select('created_at, flashcards')
        .eq('user_id', user.id)
        .gte('created_at', fromDate.toISOString());

    if (error) {
        console.error("Error fetching flashcard sets:", error);
        return [];
    }

    console.log("Fetched flashcard sets:", data.length);
    return data;
}

async function renderFlashcardChart() {
    console.log("Rendering chart...");
    const data = await getFlashcardsPerDay(7);

    const labels = [];
    const counts = {};

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        labels.push(d.toLocaleDateString(undefined, { weekday: 'short' }));
        counts[key] = 0;
    }

    data.forEach(set => {
        const day = set.created_at.split('T')[0];
        if (counts[day] !== undefined) {
            counts[day] += Array.isArray(set.flashcards) ? set.flashcards.length : 0;
        }
    });

    const values = Object.values(counts);
    console.log("Flashcards per day:", counts);

    const canvas = document.getElementById('flashcardsChart');
    if (!canvas) {
        console.error("Canvas element #flashcardsChart not found!");
        return;
    }

    new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Flashcards created',
                data: values,
                backgroundColor: '#4ade80',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    backgroundColor: '#111'
                }
            },
            scales: {
                x: {
                    ticks: { color: '#ffffff', font: { size: 12 } },
                    grid: { color: 'rgba(255,255,255,0.2)' }
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: '#ffffff', stepSize: 1, font: { size: 12 } },
                    grid: { color: 'rgba(255,255,255,0.2)' }
                }
            }
        }
    });

    console.log("Chart rendered successfully!");
}

async function waitForUserAndRenderChart() {
    console.log("Waiting for user...");
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.log("User not yet available, retrying...");
        setTimeout(waitForUserAndRenderChart, 300);
        return;
    }

    console.log("User session ready:", user.id);
    renderFlashcardChart();
}

document.addEventListener('DOMContentLoaded', waitForUserAndRenderChart);