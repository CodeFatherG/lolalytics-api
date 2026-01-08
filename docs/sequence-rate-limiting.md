```mermaid
sequenceDiagram
    participant API as API Function
    participant Http as HttpClient
    participant Limiter as RateLimiter (Bottleneck)
    participant Retry as RetryStrategy
    participant LoLalytics as LoLalytics.com

    Note over API,LoLalytics: Network Resilience: Rate Limiting + Retry + Timeout

    API->>Http: fetchHtml(url)
    activate Http

    Note over Http: Configured with:<br/>- 5 second timeout<br/>- 2 max retries

    Http->>Limiter: schedule(request)
    activate Limiter
    Note over Limiter: Bottleneck configuration:<br/>maxConcurrent: 10 requests/second

    alt Queue not full
        Note over Limiter: Request immediately processed
        Limiter->>Retry: executeWithRetry(fetchFn)
        activate Retry

        Retry->>LoLalytics: HTTP GET (attempt 1, 5s timeout)

        alt Success (< 5s)
            LoLalytics-->>Retry: 200 OK, HTML response
            Retry-->>Limiter: { result: HTML, attempts: 0 }
            deactivate Retry
            Limiter-->>Http: HTML string
            deactivate Limiter
            Http-->>API: HTML string
            deactivate Http

        else Timeout or 5xx error
            LoLalytics--xRetry: Timeout/500 error

            Note over Retry: Wait 1 second (exponential backoff)
            Retry->>LoLalytics: HTTP GET (attempt 2, 5s timeout)

            alt Success on retry 1
                LoLalytics-->>Retry: 200 OK, HTML response
                Retry-->>Limiter: { result: HTML, attempts: 1 }
                deactivate Retry
                Limiter-->>Http: HTML string
                deactivate Limiter
                Http-->>API: HTML string
                deactivate Http

            else Still failing
                LoLalytics--xRetry: Timeout/500 error

                Note over Retry: Wait 2 seconds (exponential backoff)
                Retry->>LoLalytics: HTTP GET (attempt 3, 5s timeout)

                alt Success on retry 2
                    LoLalytics-->>Retry: 200 OK, HTML response
                    Retry-->>Limiter: { result: HTML, attempts: 2 }
                    deactivate Retry
                    Limiter-->>Http: HTML string
                    deactivate Limiter
                    Http-->>API: HTML string
                    deactivate Http

                else All retries exhausted
                    LoLalytics--xRetry: Timeout/500 error
                    Note over Retry: Maximum retries reached (2)
                    Retry--xLimiter: Error with retry count
                    deactivate Retry
                    Limiter--xHttp: NetworkError<br/>{ url, retryAttempts: 2 }
                    deactivate Limiter
                    Http--xAPI: NetworkError
                    deactivate Http
                end
            end
        end

    else Queue full (> 10 req/s)
        Note over Limiter: Request queued until slot available
        Limiter->>Limiter: Wait for next available slot
        Note over Limiter: Enforces 10 req/s limit
        Limiter->>Retry: executeWithRetry(fetchFn)
        Note over Retry: Process as normal once dequeued
    end
```
