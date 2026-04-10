using System.Net.Http.Json;
using System.Text.Json;

namespace AlumniSmartArchive.Backend.Services
{
    public interface IAiService
    {
        Task<OcrResponse?> ProcessOcrAsync(Stream fileStream, string fileName);
        Task<FuzzySearchResponse?> FuzzySearchAsync(string query, List<string> candidates);
    }

    public class AiService : IAiService
    {
        private readonly HttpClient _httpClient;

        public AiService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("http://localhost:5000"); // AI Service Address
        }

        public async Task<OcrResponse?> ProcessOcrAsync(Stream fileStream, string fileName)
        {
            try
            {
                using var content = new MultipartFormDataContent();
                var fileContent = new StreamContent(fileStream);
                content.Add(fileContent, "file", fileName);

                var response = await _httpClient.PostAsync("/ocr", content);
                response.EnsureSuccessStatusCode();

                return await response.Content.ReadFromJsonAsync<OcrResponse>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"AI Service Error: {ex.Message}");
                return null;
            }
        }

        public async Task<FuzzySearchResponse?> FuzzySearchAsync(string query, List<string> candidates)
        {
            try
            {
                var payload = new { query, candidates, threshold = 60 };
                var response = await _httpClient.PostAsJsonAsync("/fuzzy-search", payload);
                response.EnsureSuccessStatusCode();

                return await response.Content.ReadFromJsonAsync<FuzzySearchResponse>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"AI Service Fuzzy Error: {ex.Message}");
                return null;
            }
        }
    }

    // DTOs specific for AI Service Response
    public class OcrResponse
    {
        public string Text { get; set; } = string.Empty;
        public double Confidence { get; set; }
        public Dictionary<string, object>? ExtractedData { get; set; }
    }

    public class FuzzySearchResponse
    {
        public string Query { get; set; } = string.Empty;
        public List<FuzzyResult> Results { get; set; } = new();
    }

    public class FuzzyResult
    {
        public string Text { get; set; } = string.Empty;
        public double Score { get; set; }
        public string MatchType { get; set; } = string.Empty;
    }
}
