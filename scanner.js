class MonumentScanner {
    constructor() {
        this.video = document.getElementById('cameraFeed');
        this.canvas = document.getElementById('captureCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.stream = null;
        this.isOnline = navigator.onLine;
        
        this.initializeElements();
        this.bindEvents();
        this.checkOnlineStatus();
        
        // Mock monument database
        this.monumentDatabase = [
            {
                name: "Taj Mahal",
                location: "Agra, India",
                description: "The Taj Mahal is an ivory-white marble mausoleum on the right bank of the river Yamuna in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favourite wife, Mumtaz Mahal.",
                facts: [
                    "Built between 1632-1653",
                    "UNESCO World Heritage Site since 1983",
                    "Made of white Makrana marble",
                    "Attracts 6-8 million visitors annually",
                    "One of the New Seven Wonders of the World"
                ]
            },
            {
                name: "Eiffel Tower",
                location: "Paris, France",
                description: "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower.",
                facts: [
                    "Completed in 1889",
                    "324 meters tall",
                    "Weighs approximately 10,100 tons",
                    "Painted every 7 years",
                    "Most visited paid monument in the world"
                ]
            },
            {
                name: "Statue of Liberty",
                location: "New York, USA",
                description: "The Statue of Liberty is a neoclassical sculpture on Liberty Island in New York Harbor in New York City. The copper statue was a gift from France to the United States.",
                facts: [
                    "Dedicated in 1886",
                    "46 meters tall (151 feet)",
                    "Made of copper sheets",
                    "Symbol of freedom and democracy",
                    "Torch represents enlightenment"
                ]
            }
        ];
    }

    initializeElements() {
        this.startBtn = document.getElementById('startCamera');
        this.captureBtn = document.getElementById('captureBtn');
        this.stopBtn = document.getElementById('stopCamera');
        this.scanningIndicator = document.getElementById('scanningIndicator');
        this.detectionBox = document.getElementById('detectionBox');
        this.resultsSection = document.getElementById('resultsSection');
        this.monumentInfo = document.getElementById('monumentInfo');
        this.offlineIndicator = document.getElementById('offlineIndicator');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startCamera());
        this.captureBtn.addEventListener('click', () => this.captureImage());
        this.stopBtn.addEventListener('click', () => this.stopCamera());
        
        // Online/offline detection
        window.addEventListener('online', () => this.handleOnlineStatus(true));
        window.addEventListener('offline', () => this.handleOnlineStatus(false));
    }

    checkOnlineStatus() {
        this.isOnline = navigator.onLine;
        this.handleOnlineStatus(this.isOnline);
    }

    handleOnlineStatus(isOnline) {
        this.isOnline = isOnline;
        if (!isOnline) {
            this.offlineIndicator.classList.remove('hidden');
            // Show cached data when offline
            if (this.resultsSection.classList.contains('hidden')) {
                this.showCachedMonumentData();
            }
        } else {
            this.offlineIndicator.classList.add('hidden');
        }
    }

    async startCamera() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    width: { ideal: 640 }, 
                    height: { ideal: 480 },
                    facingMode: 'environment' // Use back camera on mobile
                }
            });
            
            this.video.srcObject = this.stream;
            this.video.play();
            
            // Update UI
            this.startBtn.classList.add('hidden');
            this.captureBtn.classList.remove('hidden');
            this.stopBtn.classList.remove('hidden');
            this.scanningIndicator.classList.remove('hidden');
            
            // Start auto-scanning simulation
            this.startAutoScanning();
            
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Unable to access camera. Please ensure you have granted camera permissions.');
        }
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        // Update UI
        this.startBtn.classList.remove('hidden');
        this.captureBtn.classList.add('hidden');
        this.stopBtn.classList.add('hidden');
        this.scanningIndicator.classList.add('hidden');
        this.detectionBox.classList.add('hidden');
        
        this.video.srcObject = null;
        this.clearAutoScanning();
    }

    startAutoScanning() {
        // Simulate monument detection after random interval
        this.scanningTimeout = setTimeout(() => {
            this.simulateMonumentDetection();
        }, Math.random() * 5000 + 3000); // 3-8 seconds
    }

    clearAutoScanning() {
        if (this.scanningTimeout) {
            clearTimeout(this.scanningTimeout);
        }
    }

    simulateMonumentDetection() {
        this.scanningIndicator.classList.add('hidden');
        this.detectionBox.classList.remove('hidden');
        
        // Auto capture after detection
        setTimeout(() => {
            this.captureImage();
        }, 1500);
    }

    captureImage() {
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        this.ctx.drawImage(this.video, 0, 0);
        
        // Convert to blob and process
        this.canvas.toBlob((blob) => {
            this.processImage(blob);
        }, 'image/jpeg', 0.8);
    }

    async processImage(imageBlob) {
        if (this.isOnline) {
            try {
                // Simulate API call delay
                await this.simulateAPICall(imageBlob);
            } catch (error) {
                console.error('API call failed:', error);
                this.showCachedMonumentData();
            }
        } else {
            this.showCachedMonumentData();
        }
    }

    async simulateAPICall(imageBlob) {
        // Show loading state
        this.showLoadingState();
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In a real implementation, you would send the image to Google Vision API:
        /*
        const formData = new FormData();
        formData.append('image', imageBlob);
        
        const response = await fetch('https://vision.googleapis.com/v1/images:annotate?key=YOUR_API_KEY', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                requests: [{
                    image: {
                        content: await this.blobToBase64(imageBlob)
                    },
                    features: [{
                        type: 'LANDMARK_DETECTION',
                        maxResults: 1
                    }]
                }]
            })
        });
        
        const data = await response.json();
        */
        
        // For demo, randomly select a monument
        const randomMonument = this.monumentDatabase[
            Math.floor(Math.random() * this.monumentDatabase.length)
        ];
        
        this.displayMonumentInfo(randomMonument);
    }

    showLoadingState() {
        this.resultsSection.classList.remove('hidden');
        this.monumentInfo.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Analyzing monument...</p>
            </div>
        `;
        
        // Add spinner styles
        if (!document.getElementById('spinnerStyles')) {
            const style = document.createElement('style');
            style.id = 'spinnerStyles';
            style.textContent = `
                .loading-state {
                    text-align: center;
                    padding: 40px;
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #667eea;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    showCachedMonumentData() {
        // Show a random monument from cache when offline
        const cachedMonument = this.monumentDatabase[0]; // Show Taj Mahal as default
        this.displayMonumentInfo(cachedMonument, true);
    }

    displayMonumentInfo(monument, isCached = false) {
        this.resultsSection.classList.remove('hidden');
        
        const cacheIndicator = isCached ? 
            '<div class="cache-indicator">📱 Showing cached data</div>' : '';
        
        this.monumentInfo.innerHTML = `
            ${cacheIndicator}
            <div class="monument-card">
                <h3 class="monument-title">${monument.name}</h3>
                <p class="monument-location">📍 ${monument.location}</p>
                <p class="monument-description">${monument.description}</p>
                
                <div class="monument-facts">
                    <h4>Interesting Facts:</h4>
                    <ul class="facts-list">
                        ${monument.facts.map(fact => `<li>${fact}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;

        // Add cache indicator styles
        if (!document.getElementById('cacheStyles')) {
            const style = document.createElement('style');
            style.id = 'cacheStyles';
            style.textContent = `
                .cache-indicator {
                    background: #e3f2fd;
                    color: #1976d2;
                    padding: 10px;
                    border-radius: 5px;
                    text-align: center;
                    margin-bottom: 15px;
                    border: 1px solid #bbdefb;
                }
            `;
            document.head.appendChild(style);
        }

        // Reset AR overlays
        this.detectionBox.classList.add('hidden');
        this.scanningIndicator.classList.remove('hidden');
        
        // Restart auto-scanning
        this.clearAutoScanning();
        this.startAutoScanning();
    }

    async blobToBase64(blob) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(blob);
        });
    }
}

// Initialize the scanner when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MonumentScanner();
});