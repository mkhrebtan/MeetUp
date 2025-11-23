using FluentValidation;

namespace MeetUp.Application.Users.Commands.Register;

internal sealed class RegisterUserCommandValidator : AbstractValidator<RegisterUserCommand>
{
    public RegisterUserCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(8).WithMessage("Password must be at least 8 characters long")
            .Must(HaveAtLeastOneDigitAndSpecialCharacter).WithMessage("Password must contain at least one digit and one special character");

        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("FirstName is required")
            .MinimumLength(2).WithMessage("FirstName must be at least 2 characters long")
            .MaximumLength(50).WithMessage("FirstName must not exceed 50 characters");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("LastName is required")
            .MinimumLength(2).WithMessage("LastName must be at least 2 characters long")
            .MaximumLength(50).WithMessage("LastName must not exceed 50 characters");
    }

    private static bool HaveAtLeastOneDigitAndSpecialCharacter(string password)
    {
        return password.Any(char.IsDigit) && password.Any(ch => !char.IsLetterOrDigit(ch));
    }
}