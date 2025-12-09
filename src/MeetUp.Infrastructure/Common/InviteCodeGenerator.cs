using System.Security.Cryptography;
using MeetUp.Application.Common.Interfaces;

namespace MeetUp.Infrastructure.Common;

public class InviteCodeGenerator : IInviteCodeGenerator
{
    private static readonly char[] _chars = "23456789BCDFGHJKLMNPQRSTVWXYZ".ToCharArray(); 
    
    public string Generate()
    {
        const int length = 9; 
        var data = new byte[length];
        
        using (var crypto = RandomNumberGenerator.Create())
        {
            crypto.GetBytes(data);
        }

        var result = new char[length];
        for (var i = 0; i < length; i++)
        {
            result[i] = _chars[data[i] % _chars.Length];
        }
        
        return $"{new string(result, 0, 3)}-{new string(result, 3, 3)}-{new string(result, 6, 3)}";
    }
}