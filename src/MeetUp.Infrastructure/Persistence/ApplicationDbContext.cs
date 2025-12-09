using MeetUp.Application.Common.Interfaces;
using MeetUp.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace MeetUp.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext() : base()
    {
    }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }
    
    public DbSet<User> Users { get; set; }

    public DbSet<Meeting> Meetings { get; set; }
    
    public DbSet<Workspace> Workspaces { get; set; }
    
    public DbSet<WorkspaceUser> WorkspaceUsers { get; set; }
    
    public DbSet<MeetingParticipant> MeetingParticipants { get; set; }
    
    public DbSet<Invitation> Invitations { get; set; }
    
    public DbSet<SharedRecord> SharedRecords { get; set; }
    
    public DbSet<RecordViews> RecordViews { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql();
        base.OnConfiguring(optionsBuilder);
    }
}