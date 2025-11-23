using System.Reflection;

namespace MeetUp.Domain.Abstraction;

public abstract class Enumeration<TEnum> : IEquatable<Enumeration<TEnum>>
    where TEnum : Enumeration<TEnum>
{
    private static readonly Dictionary<string, TEnum> _enumerations = CreateEnumerations();

    protected Enumeration(string code, string name)
    {
        Code = code;
        Name = name;
    }
    
    public string Code { get; private init; }

    public string Name { get; private init; }

    public static TEnum? FromCode(string code)
    {
        return _enumerations.GetValueOrDefault(code);
    }

    public static TEnum? FromName(string name)
    {
        return _enumerations.Values.SingleOrDefault(e => e.Name == name);
    }

    public bool Equals(Enumeration<TEnum>? other)
    {
        return other is not null &&
               GetType() == other.GetType() &&
               Code == other.Code;
    }

    public override bool Equals(object? obj)
    {
        return obj is Enumeration<TEnum> other &&
               Equals(other);
    }

    public override int GetHashCode()
    {
        return Code.GetHashCode();
    }

    public override string ToString()
    {
        return Code;
    }

    private static Dictionary<string, TEnum> CreateEnumerations()
    {
        var enumerationType = typeof(TEnum);
        var fields = enumerationType
            .GetFields(
                BindingFlags.Public |
                BindingFlags.Static |
                BindingFlags.FlattenHierarchy)
            .Where(fieldInfo => enumerationType.IsAssignableFrom(fieldInfo.FieldType))
            .Select(fieldInfo => (TEnum)fieldInfo.GetValue(null)!);

        return fields.ToDictionary(e => e.Code);
    }
}